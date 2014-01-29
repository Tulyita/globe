'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var sinon = require('sinon');
var isOwnerOrSelf = require('../../../../../server/routes/guilds/middleware/isOwnerOrSelf');
var Guild = require('../../../../../server/models/guild');

describe('guild/middleware/isOwnerOrSelf', function() {

	var guild, memberId, ownerId;

	beforeEach(function(done) {
		memberId = mongoose.Types.ObjectId();
		ownerId = mongoose.Types.ObjectId();
		Guild.create({_id: 'racers', members: [{_id: memberId, name: 'cccc', site: 'j', group: 'u'}], owners: [{_id: ownerId, name: 'bbbb', site: 'j', group: 'u'}]}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
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
		isOwnerOrSelf(req, res, next);
		expect(res.callCount).toBe(0);
		expect(next.callCount).toBe(1);
	});


	it('should call next if you are the specified user', function() {
		var req = {
			session: {
				_id: memberId
			},
			params: {
				userId: memberId
			},
			guild: guild
		};
		var res = sinon.stub();
		var next = sinon.stub();
		isOwnerOrSelf(req, res, next);
		expect(res.callCount).toBe(0);
		expect(next.callCount).toBe(1);
	});


	it('should return an error if you are not a guild owner or the specified user', function() {
		var req = {
			session: {
				_id: memberId
			},
			params: {
				userId: 'someotherid'
			},
			guild: guild
		};
		var res = {apiOut: sinon.stub()};
		var next = sinon.stub().returns({});
		isOwnerOrSelf(req, res, next);
		expect(res.apiOut.args[0]).toEqual(['You must be an owner of this guild or the specified member to do this']);
		expect(next.callCount).toBe(0);
	});

});