'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var invitations = require('../../../../server/routes/guilds/invitations');
var Guild = require('../../../../server/models/guild');

describe('routes/guilds/invitations', function() {

	var guild;

	beforeEach(function(done) {
		Guild.create({_id: 'racers', invitations: [{_id: mongoose.Types.ObjectId(), name: 'aaaa', site: 'j', group: 'u'}]}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});

	describe('get', function() {

		it('should return a list of invitations', function(done) {
			var req = {
				params: {
					guildId: 'racers'
				},
				guild: guild
			};
			invitations.get(req, {apiOut: function(err, res) {
				expect(res.length).toBe(1);
				expect(res[0].name).toBe('aaaa');
				done(err);
			}});
		});
	});
});