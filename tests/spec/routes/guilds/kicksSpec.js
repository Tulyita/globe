'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var kicks = require('../../../../server/routes/guilds/kicks');
var Guild = require('../../../../server/models/guild');

describe('routes/guilds/kicks', function() {

	var guild;

	beforeEach(function(done) {
		Guild.create({_id: 'foxes', kicks: [{_id: mongoose.Types.ObjectId(), name: 'aaaa', site: 'j', group: 'u'}]}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});

	describe('get', function() {

		it('should return a list of kicked users in a guild', function(done) {
			var req = {
				params: {
					guildId: 'foxes'
				},
				guild: guild
			};
			kicks.get(req, {apiOut: function(err, res) {
				expect(res.length).toBe(1);
				expect(res[0].name).toBe('aaaa');
				done(err);
			}});
		});
	});
});