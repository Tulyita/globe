'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var User = require('../../../server/models/user');
var friend = require('../../../server/routes/friend');

describe('routes/friend', function() {

	var myself, bbbb, cccc;

	beforeEach(function(done) {
		var myselfData = {
			name: 'aaaa',
			site: 'j',
			group: 'u',
			siteUserId: '123',
			friends: [{
				_id: mongoose.Types.ObjectId(),
				name: 'bbbb',
				group: 'm',
				site: 'k'
			}]
		};

		User.create(myselfData, function(err1, user) {
			myself = user;
			bbbb = myself.friends[0];

			User.create({name: 'cccc', site: 'j', group: 'u', siteUserId: '758'}, function(err2, _cccc_) {
				cccc = _cccc_;
				done(err1 || err2);
			});
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('get', function() {

		it('should return a friend', function(done) {
			var req = {
				params: {
					userId: String(bbbb._id)
				},
				myself: myself
			};
			friend.get(req, {apiOut: function(err, reply) {
				expect(reply._id).toBe(bbbb._id);
				done(err);
			}});
		});
	});


	describe('put', function() {

		it('should add a friend', function(done) {
			var req = {
				params: {
					userId: String(cccc._id)
				},
				myself: myself,
				user: cccc
			};
			friend.put(req, {apiOut: function(err, reply) {
				expect(reply._id).toEqual(cccc._id);
				expect(myself.friends.length).toBe(2);
				done(err);
			}});
		});
	});


	describe('del', function() {

		it('should delete a friend', function(done) {
			var req = {
				params: {
					userId: String(myself.friends[0]._id)
				},
				myself: myself
			};
			friend.del(req, {send: function(code, message) {
				expect(code).toBe(204);
				expect(message).toBeFalsy();
				expect(myself.friends.length).toBe(0);
				done();
			}});
		});
	})
});