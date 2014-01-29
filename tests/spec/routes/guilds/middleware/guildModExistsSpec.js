'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var sinon = require('sinon');
var guildModExists = require('../../../../../server/routes/guilds/middleware/guildModExists');
var Guild = require('../../../../../server/models/guild');

describe('guildModExists', function() {

	var guild, userId;

	beforeEach(function(done) {
		userId = mongoose.Types.ObjectId();
		Guild.create({_id: 'racers', members: [{_id: userId, name: 'aaaa', site: 'j', group: 'u', mod: true}]}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	it('should call next if the applicant exists', function() {
		var req = {
			params: {
				guildId: 'racers',
				userId: userId
			},
			guild: guild
		};
		var res = sinon.stub();
		var next = sinon.stub();
		guildModExists(req, res, next);
		expect(res.callCount).toBe(0);
		expect(next.callCount).toBe(1);
	});


	it('should return 404 if the applicant does not exist', function() {
		var req = {
			params: {
				guildId: 'racers',
				userId: 'doesnotexist'
			},
			guild: guild
		};
		var send = sinon.stub();
		var res = {status: sinon.stub().returns({send: send})};
		var next = sinon.stub().returns({});
		guildModExists(req, res, next);
		expect(res.status.args[0]).toEqual([404]);
		expect(send.args[0]).toEqual(['Mod not found']);
		expect(next.callCount).toBe(0);
	});

});