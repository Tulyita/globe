'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var sinon = require('sinon');
var isOwner = require('../../../../../server/routes/guilds/middleware/isOwner');
var Guild = require('../../../../../server/models/guild');

describe('guild/middleware/isOwner', function() {

	var guild, userId;

	beforeEach(function(done) {
		userId = mongoose.Types.ObjectId();
		Guild.create({_id: 'racers', owners: [{_id: userId, name: 'bbbb', site: 'j', group: 'u'}]}, function(err, _guild_) {
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
				_id: userId
			},
			guild: guild
		};
		var res = sinon.stub();
		var next = sinon.stub();
		isOwner(req, res, next);
		expect(res.callCount).toBe(0);
		expect(next.callCount).toBe(1);
	});


	it('should return an error if you are not a guild owner', function() {
		var req = {
			session: {
				_id: 'wwwwww'
			},
			guild: guild
		};
		var res = {apiOut: sinon.stub()};
		var next = sinon.stub().returns({});
		isOwner(req, res, next);
		expect(res.apiOut.args[0]).toEqual(['You must be an owner of this guild to do this']);
		expect(next.callCount).toBe(0);
	});

});