'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var User = require('../../../server/models/user');
var Apprentice = require('../../../server/models/apprentice');
var apprentice = require('../../../server/routes/apprentice');
var groups = require('../../../server/config/groups');

describe('routes/apprentice', function() {

	var aaaa, bbbb, cccc, dddd;

	beforeEach(function(done) {
		User.create({name: 'aaaa', site: 'j', group: 'u', siteUserId: '123'}, function(err1, _aaaa_) {
			aaaa = _aaaa_;

			User.create({name: 'bbbb', site: 'a', group: 'p', siteUserId: '456'}, function(err2, _bbbb_) {
				bbbb = _bbbb_;

				User.create({name: 'cccc', site: 'f', group: 'm', siteUserId: '789'}, function(err3, _cccc_) {
					cccc = _cccc_;

					User.create({name: 'dddd', site: 'f', group: 'm', siteUserId: '000'}, function(err4, _dddd_) {
						dddd = _dddd_;

						Apprentice.create({keeper: cccc._id, apprentice: bbbb._id}, function(err5) {
							done(err1 || err2 || err3 || err4 || err5);
						});
					});
				});
			});
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('get', function() {

		it('should return a apprentice', function(done) {
			var req = {
				user: bbbb
			};
			apprentice.get(req, {apiOut: function(err, reply) {
				expect(reply).toEqual(bbbb);
				done(err);
			}});
		});
	});


	describe('put', function() {

		it('should create a apprentice', function(done) {
			var req = {
				user: aaaa,
				session: {
					_id: dddd._id
				}
			};
			apprentice.put(req, {apiOut: function(err, reply) {
				expect(reply.group).toEqual(groups.APPRENTICE);
				done(err);
			}});
		});

		it('should limit the number of apprentices a mod can have', function(done) {
			var req = {
				user: aaaa,
				session: {
					_id: cccc._id
				}
			};
			apprentice.put(req, {apiOut: function(err, reply) {
				expect(err).toBe('Moderators can have at most 1 apprentice');
				done();
			}});
		});
	});


	describe('del', function() {

		it('should delete a apprentice', function(done) {
			var req = {
				user: bbbb
			};
			apprentice.del(req, {send: function(code, reply) {
				expect(code).toBe(204);
				expect(reply).toBeFalsy();

				Apprentice.count({}, function(err, count) {
					expect(count).toBe(0);
					done(err);
				});
			}});
		});
	});
});