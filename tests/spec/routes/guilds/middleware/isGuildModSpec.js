'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var sinon = require('sinon');
var isGuildMod = require('../../../../../server/routes/guilds/middleware/isGuildMod');
var Guild = require('../../../../../server/models/guild');

describe('guildModExists', function() {

	var guild, userId, ownerId;

	beforeEach(function(done) {
		userId = mongoose.Types.ObjectId();
		ownerId = mongoose.Types.ObjectId();
		Guild.create({_id: 'racers', members: [{_id: userId, name: 'aaaa', site: 'j', group: 'u', mod: true}], owners: [{_id: ownerId, name: 'bbbb', site: 'j', group: 'u'}]}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	it('should call next if you are a guild mod', function() {
		var req = {
			session: {
				_id: userId
			},
			guild: guild
		};
		var res = sinon.stub();
		var next = sinon.stub();
		isGuildMod(req, res, next);
		expect(res.callCount).toBe(0);
		expect(next.callCount).toBe(1);
	});


	it('should call next if you are a guild owner', function() {
		var req = {
			session: {
				_id: ownerId
			},
			guild: guild
		};
		var res = sinon.stub();
		var next = sinon.stub();
		isGuildMod(req, res, next);
		expect(res.callCount).toBe(0);
		expect(next.callCount).toBe(1);
	});


	it('should return an error if you are not a guild mod', function() {
		var req = {
			session: {
				_id: 'notaguildmod'
			},
			guild: guild
		};
		var res = {apiOut: sinon.stub()};
		var next = sinon.stub().returns({});
		isGuildMod(req, res, next);
		expect(res.apiOut.args[0]).toEqual(['You must be a guild owner or guild mod to do this']);
		expect(next.callCount).toBe(0);
	});

});