'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var User = require('../../../server/models/user');
var moderators = require('../../../server/routes/moderators');

describe('routes/moderators', function() {

	beforeEach(function(done) {
		User.create({name: 'aaaa', site: 'j', group: 'u', siteUserId: '123'}, function(err1) {
			User.create({name: 'bbbb', site: 'a', group: 'm', siteUserId: '456'}, function(err2) {
				done(err1 || err2);
			});
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});

	describe('get', function() {

		it('should return a list of moderators', function(done) {
			var req = {};
			moderators.get(req, {apiOut: function(err, reply) {
				expect(reply.length).toBe(1);
				expect(reply[0].name).toBe('bbbb');
				done(err);
			}});
		});
	});
});