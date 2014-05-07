'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var sinon = require('sinon');
var inviteExists = require('../../../../../server/routes/guilds/middleware/inviteExists');
var Guild = require('../../../../../server/models/guild');

describe('inviteExists', function() {

	var guild, userId;

	beforeEach(function(done) {
		userId = mongoose.Types.ObjectId();
		Guild.create({_id: 'racers', invites: [{_id: userId, name: 'aaaa', site: 'j', group: 'u'}]}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	it('should call next if the invite exists', function() {
		var req = {
			params: {
				guildId: 'racers',
				userId: userId
			},
			guild: guild
		};
		var res = sinon.stub();
		var next = sinon.stub();
		inviteExists(req, res, next);
		expect(res.callCount).toBe(0);
		expect(next.callCount).toBe(1);
	});


	it('should return 404 if the invite does not exist', function() {
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
		inviteExists(req, res, next);
		expect(res.status.args[0]).toEqual([404]);
		expect(send.args[0]).toEqual(['Invite not found']);
		expect(next.callCount).toBe(0);
	});

});