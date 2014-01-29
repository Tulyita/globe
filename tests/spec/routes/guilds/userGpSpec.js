'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var userGp = require('../../../../server/routes/guilds/userGp');
var Guild = require('../../../../server/models/guild');
var User = require('../../../../server/models/user');

describe('routes/guilds/gp', function() {

	var guild, user;

	beforeEach(function(done) {
		User.create({name: 'aaaa', site: 'j', group: 'u', siteUserId: '123'}, function(err1, _user_) {
			user = _user_;
			Guild.create({_id: 'foxes', members: [user]}, function(err2, _guild_) {
				guild = _guild_;
				done(err1 || err2);
			});
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('get', function() {

		it('should return a guild members contributed gp', function(done) {
			var req = {
				params: {
					guildId: guild._id,
					userId: user._id
				},
				guild: guild
			};
			userGp.get(req, {apiOut: function(err, res) {
				expect(res).toEqual({gpDay: 0, gpWeek: 0, gpLife: 0});
				done(err);
			}});
		});
	});


	describe('post', function() {

		it('should increment user gp and guild gp', function(done) {
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
			userGp.post(req, {apiOut: function(err, res) {
				expect(res).toEqual({gpDay: 5, gpWeek: 5, gpLife: 5});
				expect(guild.gp).toBe(5);
				expect(guild.gpDay).toBe(5);
				expect(guild.gpWeek).toBe(5);
				expect(guild.gpLife).toBe(5);
				done(err);
			}});
		});
	});
});