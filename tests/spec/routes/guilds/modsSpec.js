'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var mods = require('../../../../server/routes/guilds/mods');
var Guild = require('../../../../server/models/guild');

describe('routes/guilds/mods', function() {

	var guild;

	beforeEach(function(done) {
		Guild.create({_id: 'foxes', members: [
			{_id: mongoose.Types.ObjectId(), name: 'aaaa', site: 'j', group: 'u', mod: true},
			{_id: mongoose.Types.ObjectId(), name: 'bbbb', site: 'j', group: 'u', mod: false}
		]}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});

	describe('get', function() {

		it('should return a list of guild mods', function(done) {
			var req = {
				params: {
					guildId: 'foxes'
				},
				guild: guild
			};
			mods.get(req, {apiOut: function(err, res) {
				expect(res.length).toBe(1);
				expect(res[0].name).toBe('aaaa');
				done(err);
			}});
		});
	});
});