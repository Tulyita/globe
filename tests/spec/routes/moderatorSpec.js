'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var groups = require('../../../server/config/groups');
var User = require('../../../server/models/user');
var moderator = require('../../../server/routes/moderator');

describe('routes/moderator', function() {

	var aaaa, bbbb;

	beforeEach(function(done) {
		User.create({name: 'aaaa', site: 'j', group: 'u', siteUserId: '123'}, function(err1, _aaaa_) {
			aaaa = _aaaa_;

			User.create({name: 'bbbb', site: 'a', group: 'm', siteUserId: '456'}, function(err2, _bbbb_) {
				bbbb = _bbbb_;
				done(err1 || err2);
			});
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('get', function() {

		it('should return a moderator', function(done) {
			var req = {
				user: bbbb
			};
			moderator.get(req, {apiOut: function(err, reply) {
				expect(reply).toEqual(bbbb);
				done(err);
			}});
		});
	});


	describe('put', function() {

		it('should create a moderator', function(done) {
			var req = {
				user: aaaa
			};
			moderator.put(req, {apiOut: function(err, reply) {
				expect(reply.group).toEqual(groups.MOD);
				done(err);
			}});
		});
	});


	describe('del', function() {

		it('should delete a moderator', function(done) {
			var req = {
				user: aaaa
			};
			moderator.del(req, {send: function(code, reply) {
				expect(code).toBe(204);
				expect(reply).toBeFalsy();
				done();
			}});
		});
	});
});