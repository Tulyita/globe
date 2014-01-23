'use strict';

var mongoose = require('mongoose');
var sinon = require('sinon');
var tokens = require('../../server/routes/tokens');
var User = require('../../server/models/user');
var IpBan = require('../../server/models/ipBan');
var findOneAndSave = require('../../server/fns/mongoose/findOneAndSave');
findOneAndSave.attach(mongoose);

describe('tokensGet', function() {


	//////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////

	describe('get', function() {

		beforeEach(function() {
			sinon.stub(tokens, 'checkIpBan');
			sinon.stub(tokens, 'authenticate');
			sinon.stub(tokens, 'saveUser');
			sinon.stub(tokens, 'startSession');
		});

		afterEach(function() {
			tokens.checkIpBan.restore();
			tokens.authenticate.restore();
			tokens.saveUser.restore();
			tokens.startSession.restore();
		});

		it('should run through a bunch of functions', function() {
			tokens.checkIpBan
				.withArgs('184.106.201.44')
				.yields(null, 0);
			tokens.authenticate
				.withArgs({site: 'j', jiggToken: 'hippo'})
				.yields(null, {name: 'bob', site: 'j', siteUserId: '123', group: 'u'});
			tokens.saveUser
				.withArgs({name: 'bob', site: 'j', siteUserId: '123', group: 'u'})
				.yields(null, {_id: mongoose.Types.ObjectId(), name: 'bob', site: 'j', siteUserId: '123', group: 'u'});
			tokens.startSession
				.yields(null, 'bestSessionEver49');

			var req = {
				body: {
					site: 'j',
					jiggToken: 'hippo'
				},
				ip: '184.106.201.44'
			};
			var res = {
				apiOut: sinon.stub()
			};

			tokens.get(req, res);

			expect(tokens.checkIpBan.callCount).toBe(1);
			expect(tokens.authenticate.callCount).toBe(1);
			expect(tokens.saveUser.callCount).toBe(1);
			expect(tokens.startSession.callCount).toBe(1);
			expect(res.apiOut.args[0]).toEqual([null, {token: 'bestSessionEver49'}]);
		});
	});


	/////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////

	describe('checkIpBan', function() {

		beforeEach(function() {
			sinon.stub(IpBan, 'find')
				.withArgs({ip: 'niceip'}).yields(null, [])
				.withArgs({ip: 'badip'}).yields(null, ['ban1', 'ban2', 'ban3']);
		});

		afterEach(function() {
			IpBan.find.restore();
		});

		it('should yield null if ip has fewer than 3 bans', function() {
			var callback = sinon.stub();
			tokens.checkIpBan('niceip', callback);
			expect(callback.args[0]).toEqual([null]);
		});

		it('it should return an error if 3 bans are found', function() {
			var callback = sinon.stub();
			tokens.checkIpBan('badip', callback);
			expect(callback.args[0]).toEqual(['This ip address has been temporarily blocked due to frequent abuse.']);
		});
	});


	///////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	describe('authenticate', function() {

		beforeEach(function() {
			var jiggAuth = {
				authenticate: sinon.stub()
			};

			jiggAuth.authenticate
				.withArgs({site: 'j', jiggToken: 'abc'})
				.yields(null, {siteUserId: '1', name: 'bob', site: 'j', group: 'u'});
			jiggAuth.authenticate
				.withArgs({site: 'j', jiggToken: 'zzz'})
				.yields(null, {notRight: true});

			sinon.stub(tokens, 'siteToAuth')
				.withArgs('j')
				.returns(jiggAuth)
		});

		afterEach(function() {
			tokens.siteToAuth.restore();
		});

		it('should yield the result from an authenticator function', function() {
			var data = {
				site: 'j',
				jiggToken: 'abc'
			};
			var callback = sinon.stub();
			tokens.authenticate(data, callback);
			expect(callback.args[0]).toEqual([null, {siteUserId: '1', name: 'bob', site: 'j', group: 'u'}]);
		});

		it('should yield an error for an unknown site', function() {
			var data = {
				site: 'u',
				jiggToken: 'abc'
			};
			var callback = sinon.stub();
			tokens.authenticate(data, callback);
			expect(callback.args[0]).toEqual(['site not found']);
		});

		it('should yield an error if the validator does not return the correct values', function() {
			var data = {
				site: 'j',
				jiggToken: 'zzz'
			};
			var callback = sinon.stub();
			tokens.authenticate(data, callback);
			expect(callback.args[0]).toEqual(['Name, site, siteUserId, and group are required from auth.']);
		});
	});


	//////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////

	describe('saveUser', function() {

		beforeEach(function() {
			sinon.stub(User, 'findOneAndSave')
				.withArgs({site: 'j', siteUserId: '123'})
				.yields(null, {_id: 'asd', name: 'Bill', site: 'j', group: 'u'});
		});

		afterEach(function() {
			User.findOneAndSave.restore();
		});

		it('should should call User.findOneAndSave', function() {
			var verified = {
				site: 'j',
				siteUserId: '123',
				name: 'Bill',
				group: 'u'
			};
			var callback = sinon.stub();
			tokens.saveUser(verified, callback);
			expect(callback.args[0]).toEqual([null, {_id: 'asd', name: 'Bill', site: 'j', group: 'u'}]);
		});

		it('should yield an error if User.findOneAndSave yields and error', function() {
			User.findOneAndSave
				.withArgs({site: 'j', siteUserId: '999'})
				.yields('mongo error');
			var verified = {
				site: 'j',
				siteUserId: '999',
				name: 'Bill',
				group: 'u'
			};
			var callback = sinon.stub();
			tokens.saveUser(verified, callback);
			expect(callback.args[0]).toEqual(['mongo error']);
		});
	});
});