'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var User = require('../../../server/models/user');
var friends = require('../../../server/routes/friends');

describe('routes/friends', function() {

	var myself;
	
	beforeEach(function(done) {
		var userData = {
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

		User.create(userData, function(err1, user) {
			myself = user;
			done(err1);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});

	describe('get', function() {

		it('should return a list my friends', function(done) {
			var req = {
				myself: myself
			};
			friends.get(req, {apiOut: function(err, reply) {
				expect(reply.length).toBe(1);
				expect(reply[0].name).toBe('bbbb');
				done(err);
			}});
		});
	});
});