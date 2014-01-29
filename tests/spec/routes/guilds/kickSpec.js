'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var kick = require('../../../../server/routes/guilds/kick');
var Guild = require('../../../../server/models/guild');
var User = require('../../../../server/models/user');

describe('kick', function() {

	var guild, user, kickedUserId;

	beforeEach(function(done) {
		kickedUserId = mongoose.Types.ObjectId();
		Guild.create({_id: 'foxes', kicks: [{_id: kickedUserId, name: 'aaaa', site: 'j', group: 'u'}]}, function(err, _guild_) {
			guild = _guild_;
			User.create({name: 'sue', site: 'j', group: 'u', siteUserId: '333'}, function(err, _user_) {
				user = _user_;
				done(err);
			});
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('put', function() {

		it('should put a kick', function(done) {
			var req = {
				params: {
					userId: user._id
				},
				guild: guild
			};
			kick.put(req, {apiOut: function(err, res) {
				expect(res.name).toBe('sue');
				expect(guild.kicks.length).toBe(2);
				done(err);
			}});
		});
	});


	describe('get', function() {

		it('should return a particular kick', function(done) {
			var req = {
				params: {
					userId: kickedUserId
				},
				guild: guild
			};
			kick.get(req, {apiOut: function(err, res) {
				expect(res.name).toBe('aaaa');
				done(err);
			}});
		});
	});
});