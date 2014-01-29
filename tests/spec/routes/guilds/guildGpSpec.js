'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var guildGp = require('../../../../server/routes/guilds/guildGp');
var Guild = require('../../../../server/models/guild');
var User = require('../../../../server/models/user');

describe('routes/guilds/gp', function() {

	var guild, user;

	beforeEach(function(done) {
		User.create({name: 'aaaa', site: 'j', group: 'u', siteUserId: '123'}, function(err1, _user_) {
			user = _user_;
			Guild.create({_id: 'foxes', owners: [user]}, function(err2, _guild_) {
				guild = _guild_;
				done(err1 || err2);
			});
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('get', function() {

		it('should return a guilds gp counters', function(done) {
			var req = {
				params: {
					guildId: guild._id
				},
				guild: guild
			};
			guildGp.get(req, {apiOut: function(err, res) {
				expect(res).toEqual({gp: 0, gpDay: 0, gpWeek: 0, gpLife: 0});
				done(err);
			}});
		});
	});


	describe('post', function() {

		it('should increment guild gp while ignoring the other counters', function(done) {
			var req = {
				params: {
					guildId: guild._id,
					userId: user._id
				},
				query: {
					inc: 5
				},
				guild: guild
			};
			guildGp.post(req, {apiOut: function(err, res) {
				expect(res).toEqual({gp: 5, gpDay: 0, gpWeek: 0, gpLife: 0});
				done(err);
			}});
		});
	});
});