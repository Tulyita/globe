'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var guilds = require('../../../../server/routes/guilds/guilds');
var Guild = require('../../../../server/models/guild');

describe('routes/guilds/guilds', function() {

	beforeEach(function(done) {
		Guild.create({_id: 'racers'}, function() {
			Guild.create({_id: 'foxes'}, function(err) {
				done(err);
			});
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});

	describe('get', function() {

		it('should return a list of guilds', function(done) {
			var req = {};
			guilds.get(req, {apiOut: function(err, res) {
				expect(res.length).toBe(2);
				expect(res[0]._id).toBe('racers');
				expect(res[1]._id).toBe('foxes');
				done(err);
			}});
		});
	});
});