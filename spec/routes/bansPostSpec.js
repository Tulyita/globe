/*global beforeEach, afterEach, expect, it, describe */
'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var User = require('../../server/models/user');
var bansPost = require('../../server/routes/bansPost');

describe('bansPost', function() {

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
			siteUserId: '123'
		}, function() {
			done();
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('saveBans', function() {

		it('should save a list of bans to a user account', function(done) {
			var bans = [
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
					reason: 'spam'
				}
			];
			bansPost.saveBans(userId, bans, function(err) {
				expect(err).toBeFalsy();

				User.findById(userId, function(err, user) {
					expect(err).toBeFalsy();
					expect(user.bans.toObject()).toEqual(bans);
					done();
				});
			});
		});
	});


	describe('getBanHistory', function() {

		it('should return an array of bans for a user', function(done) {
			bansPost.getBanHistory(userId, function(err, user) {
				expect(err).toBeFalsy();
				expect(_.isArray(user.bans)).toBe(true);
				done();
			});
		});
	});


	describe('pruneOldBans', function() {

		it('should remove long expired bans from an array', function() {
			var now = new Date();
			var bans = [
				{name: 'ban1', expireDate: new Date(0)},
				{name: 'ban2', expireDate: now},
				{name: 'ban3', expireDate: now},
				{name: 'ban4', expireDate: new Date(1)}
			];
			var prunedBans = bansPost.pruneOldBans(bans);
			expect(prunedBans).toEqual([{name: 'ban2', expireDate: now}, {name: 'ban3', expireDate: now}]);
		});
	});


	describe('determineDuration', function() {

		it('should assign longer bans if there are more prior bans', function() {
			var dur1 = bansPost.determineDuration([]);
			var dur2 = bansPost.determineDuration(['banOne']);
			var dur3 = bansPost.determineDuration(['banOne', 'banTwo']);
			var dur4 = bansPost.determineDuration(['banOne', 'banTwo', 'banThree']);

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

		bansPost.post(req, {apiOut: function(err, resp) {
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
		bansPost.post(req, {apiOut: function(err) {
			expect(err).toBeTruthy();
			done();
		}});
	});
});