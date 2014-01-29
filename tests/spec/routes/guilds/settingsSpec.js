'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var settings = require('../../../../server/routes/guilds/settings');
var Guild = require('../../../../server/models/guild');

describe('routes/guilds/settings', function() {

	var guild;

	beforeEach(function(done) {
		Guild.create({_id: 'racers', desc: 'hey', join: Guild.OPEN, hasBanner: true}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('post', function() {

		it('should update settings', function(done) {
			var req = {
				params: {
					guildId: 'racers'
				},
				body: {
					desc: 'lights',
					hasBanner: false,
					join: Guild.INVITE
				},
				guild: guild
			};
			settings.post(req, {apiOut: function(err, res) {
				expect(res).toEqual({desc: 'lights', join: Guild.INVITE, hasBanner: false});
				done(err);
			}});
		});
	});


	describe('get', function() {

		it('should return available guild settings', function(done) {
			var req = {
				params: {
					guildId: 'racers'
				},
				guild: guild
			};
			settings.get(req, {apiOut: function(err, res) {
				expect(res).toEqual({desc: 'hey', join: Guild.OPEN, hasBanner: true});
				done(err);
			}});
		});
	});
});