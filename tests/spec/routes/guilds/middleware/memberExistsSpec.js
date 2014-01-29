'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var sinon = require('sinon');
var memberExists = require('../../../../../server/routes/guilds/middleware/memberExists');
var Guild = require('../../../../../server/models/guild');

describe('routes/guilds/invitation', function() {

	var guild, userId;

	beforeEach(function(done) {
		userId = mongoose.Types.ObjectId();
		Guild.create({_id: 'racers', members: [{_id: userId, name: 'aaaa', site: 'j', group: 'u'}]}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	it('should call next if the member exists', function() {
		var req = {
			params: {
				guildId: 'racers',
				userId: userId
			},
			guild: guild
		};
		var res = sinon.stub();
		var next = sinon.stub();
		memberExists(req, res, next);
		expect(res.callCount).toBe(0);
		expect(next.callCount).toBe(1);
	});


	it('should return 404 if the member does not exist', function() {
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
		memberExists(req, res, next);
		expect(res.status.args[0]).toEqual([404]);
		expect(send.args[0]).toEqual(['Member not found']);
		expect(next.callCount).toBe(0);
	});

});