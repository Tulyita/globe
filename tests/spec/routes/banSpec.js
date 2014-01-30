'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var sinon = require('sinon');
var User = require('../../../server/models/user');
var ban = require('../../../server/routes/ban');


describe('bans', function() {

	var user;

	beforeEach(function(done) {
		User.create({
			_id: mongoose.Types.ObjectId(),
			name: 'bob',
			site: 'j',
			group: 'u',
			siteUserId: '123',
			ip: '64.233.160.0'
		}, function(err, _user_) {
			user = _user_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	//////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////

	describe('get', function() {

		it('should return what mongoose finds', function(done) {
			var req = {
				user: user
			};
			ban.get(req, {apiOut: function(err, reply) {
				expect(reply).toEqual(user.bans);
				done(err);
			}});
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
			var prunedBans = ban._pruneOldBans(banArr);
			expect(prunedBans).toEqual([{name: 'ban2', expireDate: now}, {name: 'ban3', expireDate: now}]);
		});
	});


	///////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	describe('determineDuration', function() {

		it('should assign longer bans if there are more prior bans', function() {
			var dur1 = ban._determineDuration([]);
			var dur2 = ban._determineDuration(['banOne']);
			var dur3 = ban._determineDuration(['banOne', 'banTwo']);
			var dur4 = ban._determineDuration(['banOne', 'banTwo', 'banThree']);

			expect(dur1).toBeLessThan(dur2);
			expect(dur2).toBeLessThan(dur3);
			expect(dur3).toBeLessThan(dur4);
		});
	});


	//////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	describe('post', function() {

		it('should save a ban to mongo', function(done) {
			var req = {
				params: {
					userId: user._id
				},
				body: {
					type: 'silence',
					reason: 'spam',
					privateInfo: {message: 'bla'}
				},
				session: {
					_id: mongoose.Types.ObjectId(),
					name: 'Villa',
					site: 'j',
					group: 'm'
				},
				user: user
			};

			ban.post(req, {apiOut: function(err, resp) {
				expect(err).toBeFalsy();
				expect(resp).toBeTruthy();
				if(resp) {
					expect(resp.type).toEqual('silence');
					expect(resp.mod).toEqual({_id: req.session._id, name: 'Villa', site: 'j', group: 'm'});
				}
				expect(user.bans.toObject()[0].reason).toEqual('spam');
				done();
			}});
		});
	});
});