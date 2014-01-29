'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var sinon = require('sinon');
var isSelf = require('../../../../../server/routes/guilds/middleware/isSelf');
var Guild = require('../../../../../server/models/guild');

describe('guild/middleware/isSelf', function() {

	var guild, memberId;

	beforeEach(function(done) {
		memberId = mongoose.Types.ObjectId();
		Guild.create({_id: 'racers', members: [{_id: memberId, name: 'cccc', site: 'j', group: 'u'}]}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
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
		isSelf(req, res, next);
		expect(res.callCount).toBe(0);
		expect(next.callCount).toBe(1);
	});


	it('should return an error if you are not the specified user', function() {
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
		isSelf(req, res, next);
		expect(res.apiOut.args[0]).toEqual(['You can not do this for another member']);
		expect(next.callCount).toBe(0);
	});

});