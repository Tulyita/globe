'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var guildResource = require('../../../../server/routes/guilds/guild');
var Guild = require('../../../../server/models/guild');
var User = require('../../../../server/models/user');

describe('routes/guilds/guild', function() {

	var guild;

	beforeEach(function(done) {
		Guild.create({_id: 'racers'}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});

	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('put', function() {

		it('should put a guild', function(done) {
			var req = {
				session: {
					_id: mongoose.Types.ObjectId(),
					name: 'aaaa',
					site: 'j',
					group: 'u'
				},
				params: {
					guildId: 'newGuild'
				}
			};
			guildResource.put(req, {apiOut: function(err, res) {
				expect(res._id).toEqual('newGuild');
				expect(res.owners[0]._id).toEqual(req.session._id);
				expect(res.members[0]._id).toEqual(req.session._id);
				done(err);
			}});
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('get', function() {

		it('should get a guild', function(done) {
			var req = {
				params: {
					guildId: 'racers'
				},
				guild: guild
			};
			guildResource.get(req, {apiOut: function(err, res) {
				expect(res._id).toEqual('racers');
				done(err);
			}});
		});
	});


	////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////

	describe('del', function() {

		it('should delete a guild', function(done) {
			var req = {
				params: {
					guildId: 'racers'
				},
				guild: guild
			};
			guildResource.del(req, {status: function(code) {
				expect(code).toEqual(204);
				return {send: function(msg) {
					expect(msg).toBeFalsy();
					done();
				}};
			}});
		});
	});
});