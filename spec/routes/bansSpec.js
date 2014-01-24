'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var sinon = require('sinon');
var User = require('../../server/models/user');
var bans = require('../../server/routes/bans');


describe('bans', function() {

	var userId;
	var modId;

	beforeEach(function(done) {
		userId = mongoose.Types.ObjectId();
		modId = mongoose.Types.ObjectId();

		User.create({
			_id: userId,
			name: 'bob',
			site: 'j',
			group: 'u',
			siteUserId: '123',
			ip: '64.233.160.0'
		}, function() {
			done();
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	//////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////

	describe('get', function() {

		beforeEach(function() {
			sinon.stub(User, 'findById');
		});

		afterEach(function() {
			User.findById.restore();
		});

		it('should return what mongoose finds', function(done) {
			User.findById
				.withArgs('abc')
				.yields(null, {_id: 'abc',bans: [{name: 'ban1'}, {name: 'ban2'}]});
			var req = {
				body: {userId: 'abc'}
			};
			bans.get(req, {apiOut: function(err, resp) {
				expect(err).toBeFalsy();
				expect(resp.bans).toEqual([{name: 'ban1'}, {name: 'ban2'}]);
				done();
			}});
		});

		it('should return an error if mongoose returns an error', function(done) {
			User.findById
				.withArgs('errorTime')
				.yields('There was a horrible error');
			var req = {
				body: {userId: 'errorTime'}
			};
			bans.get(req, {apiOut: function(err) {
				expect(err).toBeTruthy();
				done();
			}});
		});
	});


	/////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////

	describe('saveBans', function() {

		it('should save a list of bans to a user account', function(done) {
			var banArr = [
				{
					_id: mongoose.Types.ObjectId(),
					type: 'ban',
					mod: {
						_id: modId,
						name: 'mod',
						site: 'j',
						group: 'm'
					},
					date: new Date(0),
					expireDate: new Date(1),
					reason: 'spam',
					ip: '64.233.160.0'
				}
			];
			bans.saveBans(userId, banArr, function(err) {
				expect(err).toBeFalsy();

				User.findById(userId, function(err, user) {
					expect(err).toBeFalsy();
					expect(user.bans.toObject()).toEqual(banArr);
					done();
				});
			});
		});
	});


	////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	describe('getBanHistory', function() {

		it('should return an array of bans for a user', function(done) {
			bans.getBanHistory(userId, function(err, user) {
				expect(err).toBeFalsy();
				expect(_.isArray(user.bans)).toBe(true);
				done();
			});
		});
	});


	/////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////

	describe('pruneOldBans', function() {

		it('should remove long expired bans from an array', function() {
			var now = new Date();
			var banArr = [
				{name: 'ban1', expireDate: new Date(0)},
				{name: 'ban2', expireDate: now},
				{name: 'ban3', expireDate: now},
				{name: 'ban4', expireDate: new Date(1)}
			];
			var prunedBans = bans.pruneOldBans(banArr);
			expect(prunedBans).toEqual([{name: 'ban2', expireDate: now}, {name: 'ban3', expireDate: now}]);
		});
	});


	///////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	describe('determineDuration', function() {

		it('should assign longer bans if there are more prior bans', function() {
			var dur1 = bans.determineDuration([]);
			var dur2 = bans.determineDuration(['banOne']);
			var dur3 = bans.determineDuration(['banOne', 'banTwo']);
			var dur4 = bans.determineDuration(['banOne', 'banTwo', 'banThree']);

			expect(dur1).toBeLessThan(dur2);
			expect(dur2).toBeLessThan(dur3);
			expect(dur3).toBeLessThan(dur4);
		});
	});


	it('should save a ban to mongo', function(done) {
		var req = {
			body: {
				type: 'silence',
				reason: 'spam',
				privateInfo: {message: 'bla'},
				userId: userId
			},
			session: {
				_id: modId,
				name: 'Villa',
				site: 'j',
				group: 'm'
			}
		};

		bans.post(req, {apiOut: function(err, resp) {
			expect(err).toBeFalsy();
			expect(resp).toBeTruthy();
			if(resp) {
				expect(resp.type).toEqual('silence');
				expect(resp.mod).toEqual({_id: modId, name: 'Villa', site: 'j', group: 'm'});
			}

			User.findById(userId, function(err, user) {
				expect(err).toBeFalsy();
				expect(user).toBeTruthy();
				expect(user.bans.toObject()[0].reason).toEqual('spam');
				done();
			});
		}});
	});


	it('should return an error if something goes wrong', function(done) {
		var req = {
			body: {
				hi: 'malformed request',
				type: 'wewewe'
			}
		};
		bans.post(req, {apiOut: function(err) {
			expect(err).toBeTruthy();
			done();
		}});
	});

});