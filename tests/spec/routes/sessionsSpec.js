'use strict';

var mongoose = require('mongoose');
var sinon = require('sinon');
var sessions = require('../../../server/routes/sessions');
var User = require('../../../server/models/user');
var IpBan = require('../../../server/models/ipBan');
var session = require('../../../server/fns/redisSession');
var authServices = require('../../../server/fns/auth/authServices');
var findOneAndSave = require('../../../server/fns/mongoose/findOneAndSave');
findOneAndSave.attach(mongoose);

describe('sessionsGet', function() {


	//////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////

	describe('post', function() {

		beforeEach(function() {
			sinon.stub(sessions, 'checkIpBan');
			sinon.stub(authServices, 'authenticate');
			sinon.stub(sessions, 'saveUser');
			sinon.stub(sessions, 'processUser');
			sinon.stub(sessions, 'startSession');
		});

		afterEach(function() {
			sessions.checkIpBan.restore();
			authServices.authenticate.restore();
			sessions.saveUser.restore();
			sessions.processUser.restore();
			sessions.startSession.restore();
		});

		it('should run through a bunch of functions', function() {
			var authInfo = {site: 'j', jiggToken: 'hippo'};
			var authReply = {name: 'bob', site: 'j', siteUserId: '123', group: 'u'};
			var user = {_id: mongoose.Types.ObjectId(), name: 'bob', site: 'j', siteUserId: '123', group: 'u', bans: []};

			sessions.checkIpBan
				.withArgs('184.106.201.44')
				.yields(null, 0);
			authServices.authenticate
				.withArgs(authInfo)
				.yields(null, authReply);
			sessions.saveUser
				.withArgs(authReply)
				.yields(null, user);
			sessions.processUser
				.withArgs(user)
				.yields(null);
			sessions.startSession
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

			sessions.post(req, res);

			expect(sessions.checkIpBan.callCount).toBe(1);
			expect(authServices.authenticate.callCount).toBe(1);
			expect(sessions.saveUser.callCount).toBe(1);
			expect(sessions.startSession.callCount).toBe(1);
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
			sessions.checkIpBan('niceip', callback);
			expect(callback.args[0]).toEqual([null]);
		});

		it('it should return an error if 3 bans are found', function() {
			var callback = sinon.stub();
			sessions.checkIpBan('badip', callback);
			expect(callback.args[0]).toEqual(['This ip address has been temporarily blocked due to frequent abuse.']);
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
			sessions.saveUser(verified, callback);
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
			sessions.saveUser(verified, callback);
			expect(callback.args[0]).toEqual(['mongo error']);
		});
	});


	/////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////

	describe('processUser', function() {

		beforeEach(function() {
			sinon.stub(sessions, 'findActiveBan');
		});

		afterEach(function() {
			sessions.findActiveBan.restore();
		});

		it('should not alter user if there are no active bans', function() {
			sessions.findActiveBan.withArgs([]).returns(null);
			var user = {
				bans: []
			};
			var callback = sinon.stub();
			sessions.processUser(user, callback);
			expect(callback.args[0]).toEqual([null]);
			expect(user.silencedUntil).toBe(undefined);
		});

		it('should set silencedUntil on user if there is an active silence', function() {
			var expireDate = new Date(1);
			var ban = {type: 'silence', expireDate: expireDate, reason: 'spam'};
			sessions.findActiveBan.withArgs([ban]).returns(ban);
			var user = {
				bans: [ban]
			};
			var callback = sinon.stub();
			sessions.processUser(user, callback);
			expect(callback.args[0]).toEqual([null]);
			expect(user.silencedUntil).toEqual(new Date(1));
		});

		it('should yield an error if the user is banned', function() {
			var expireDate = new Date(1);
			var ban = {type: 'ban', expireDate: expireDate, reason: 'spam'};
			sessions.findActiveBan.withArgs([ban]).returns(ban);
			var user = {
				bans: [ban]
			};
			var callback = sinon.stub();
			sessions.processUser(user, callback);
			expect(callback.args[0]).toEqual(['This account has been banned until Wed Dec 31 1969 19:00:00 GMT-0500 (EST). Reason: spam']);
		});
	});


	///////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	describe('startSession', function() {

		beforeEach(function() {
			sinon.stub(session, 'make');
		});

		afterEach(function() {
			session.make.restore();
		});

		it('should call session.make and yield the token', function() {
			var token = '123abc';
			var userId = mongoose.Types.ObjectId();
			var user = {_id: userId, name: 'bob', site: 'j', group: 'u', silencedUntil: new Date(1), guild: 'best guild', extra: 'should not be included'};
			var expectedSessionData = {_id: userId, name: 'bob', site: 'j', group: 'u', silencedUntil: new Date(1), guild: 'best guild'};
			var callback = sinon.stub();
			session.make.withArgs(userId, expectedSessionData).yields(null, 'OK', token);
			sessions.startSession(user, callback);
			expect(callback.args[0]).toEqual([null, token]);
		});

		it('should yield an error if session.make yields an error', function() {
			var userId = mongoose.Types.ObjectId();
			var user = {_id: userId, name: 'bob', site: 'j', group: 'u', silencedUntil: new Date(1), guild: 'best guild', extra: 'should not be included'};
			var expectedSessionData = {_id: userId, name: 'bob', site: 'j', group: 'u', silencedUntil: new Date(1), guild: 'best guild'};
			var callback = sinon.stub();
			session.make.withArgs(userId, expectedSessionData).yields('redis error');
			sessions.startSession(user, callback);
			expect(callback.args[0]).toEqual(['redis error']);
		});
	});


	/////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////

	describe('findActiveBan', function() {

		it('should return null if given an empty array', function() {
			var ban = sessions.findActiveBan([]);
			expect(ban).toBe(null);
		});

		it('should return a ban over a silence even if the silence lasts longer', function() {
			var bans = [
				{type: 'ban', expireDate: new Date( new Date().getTime()+10000 )},
				{type: 'silence', expireDate: new Date( new Date().getTime()+20000 )}
			];
			var ban = sessions.findActiveBan(bans);
			expect(ban.type).toBe('ban');
		});

		it('should return null if all bans are expired', function() {
			var bans = [
				{type: 'ban', expireDate: new Date( new Date().getTime()-10000 )},
				{type: 'silence', expireDate: new Date( new Date().getTime()-20000 )}
			];
			var ban = sessions.findActiveBan(bans);
			expect(ban).toBe(null);
		});

		it('should return a silence if there are no active bans', function() {
			var bans = [
				{type: 'ban', expireDate: new Date( new Date().getTime()-10000 )},
				{type: 'silence', expireDate: new Date( new Date().getTime()+20000 )},
				{type: 'ban', expireDate: new Date( new Date().getTime()-20000 )}
			];
			var ban = sessions.findActiveBan(bans);
			expect(ban.type).toBe('silence');
		});
	});


	////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////

	describe('del', function() {

		beforeEach(function() {
			sinon.stub(session, 'destroy');
		});

		afterEach(function() {
			session.destroy.restore();
		});

		it('should call session.destroy with the token', function() {
			session.destroy
				.withArgs('123-abc')
				.yields(null);

			var req = {
				body: {
					token: '123-abc'
				},
				session: {
					_id: '123'
				}
			};
			var res = {
				apiOut: sinon.stub()
			};
			sessions.del(req, res);
			expect(res.apiOut.args[0]).toEqual([null]);
		});
	});
});