'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var applicants = require('../../../../server/routes/guilds/applicants');
var Guild = require('../../../../server/models/guild');

describe('routes/guilds/applicants', function() {

	var guild;

	beforeEach(function(done) {
		Guild.create({_id: 'racers', applicants: [{_id: mongoose.Types.ObjectId(), name: 'aaaa', site: 'j', group: 'u'}]}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});

	describe('get', function() {

		it('should return a list of applicants', function(done) {
			var req = {
				params: {
					guildId: 'racers'
				},
				guild: guild
			};
			applicants.get(req, {apiOut: function(err, res) {
				expect(res.length).toBe(1);
				expect(res[0].name).toBe('aaaa');
				done(err);
			}});
		});
	});
});