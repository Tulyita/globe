'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var sinon = require('sinon');
var loadGuild = require('../../../../../server/routes/guilds/middleware/loadGuild');
var Guild = require('../../../../../server/models/guild');

describe('guild/middleware/loadGuild', function() {

	beforeEach(function(done) {
		Guild.create({_id: 'racers'}, function(err) {
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	it('should load a guild that exists and set it to req.guild', function(done) {
		var req = {
			params: {
				guildId: 'racers'
			}
		};
		var res = {status: sinon.stub()};
		var next = sinon.stub();
		loadGuild(req, res, function() {
			expect(res.status.callCount).toBe(0);
			expect(req.guild._id).toBe('racers');
			done();
		});
	});


	it('should return 404 if the guild does not exist', function(done) {
		var req = {
			params: {
				guildId: 'someotherid'
			}
		};
		var next = sinon.stub();
		loadGuild(req, {status: function(code) {
			expect(code).toBe(404);
			return {
				send: function(msg) {
					expect(msg).toBe('Guild not found');
					done();
				}
			}
		}}, next);
	});

});