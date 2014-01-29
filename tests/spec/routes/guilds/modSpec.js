'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var mod = require('../../../../server/routes/guilds/mod');
var Guild = require('../../../../server/models/guild');

describe('routes/guilds/mod', function() {

	var guild, userId1, userId2;

	beforeEach(function(done) {
		userId1 = mongoose.Types.ObjectId();
		userId2 = mongoose.Types.ObjectId();
		Guild.create({_id: 'foxes', members: [
			{_id: userId1, name: 'aaaa', site: 'j', group: 'u', mod: true},
			{_id: userId2, name: 'bbbb', site: 'j', group: 'u', mod: false}
		]}, function(err, _guild_) {
			guild = _guild_;
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});



	describe('put', function() {

		it('should put a mod', function(done) {
			var req = {
				params: {
					guildId: 'foxes',
					userId: userId2
				},
				guild: guild
			};
			mod.put(req, {apiOut: function(err, res) {
				expect(res.name).toBe('bbbb');
				expect(guild.members[1].mod).toBe(true);
				done(err);
			}});
		});
	});



	describe('get', function() {

		it('should yield a mod', function(done) {
			var req = {
				params: {
					guildId: 'foxes',
					userId: userId1
				},
				guild: guild
			};
			mod.get(req, {apiOut: function(err, res) {
				expect(res.name).toBe('aaaa');
				done(err);
			}});
		});
	});


	describe('del', function() {

		it('should delete a mod', function(done) {
			var req = {
				params: {
					guildId: 'foxes',
					userId: userId1
				},
				guild: guild
			};
			mod.del(req, {status: function(code) {
				expect(code).toEqual(204);
				return {send: function(msg) {
					expect(msg).toBeFalsy();
					expect(guild.members[0].mod).toBe(false);
					done();
				}};
			}});
		});
	});
});