'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var User = require('../../../../server/models/user');
var Guild = require('../../../../server/models/guild');


describe('guild/lists', function() {


	///////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////

	describe('removeMember', function() {

		var guildId, userId, userId2;

		beforeEach(function(done) {
			userId = mongoose.Types.ObjectId();
			userId2 = mongoose.Types.ObjectId();
			guildId = 'Happy Guild';

			User.create({
				_id: userId,
				name: 'aaaa',
				site: 'j',
				group: 'u',
				siteUserId: 'abc',
				guild: 'Happy Guild'
			}, function(err) {
				if(err) {
					return done(err);
				}

				return Guild.create({
					_id: guildId,
					members: [
						{_id: userId, name: 'aaaa', site: 'j', group: 'u'},
						{_id: userId2, name: 'bbbb', site: 'j', group: 'u'}
					]
				}, function(err) {
					if(err) {
						return done(err);
					}
					return done();
				});
			});
		});

		afterEach(function() {
			mockgoose.reset();
		});

		it('should remove a member from the members array', function(done) {
			return Guild.removeMember(guildId, userId, function(err) {
				if(err) {
					return done(err);
				}

				return Guild.findById(guildId, function(err, guild) {
					if(err) {
						return done(err);
					}

					expect(guild.members.length).toBe(1);
					expect(guild.members[0].name).toBe('bbbb');

					return User.findById(userId, function(err, user) {
						if(err) {
							return done(err);
						}

						expect(user.guild).toBeFalsy();
						return done();
					});
				});
			});
		});


		it('should remove a member from the array even if the user does not exist in the users collection', function(done) {
			Guild.removeMember(guildId, userId2, function(err) {
				expect(err).toBeFalsy();

				Guild.findById(guildId, function(err, guild) {
					expect(guild.members.length).toBe(1);
					expect(guild.members[0].name).toBe('aaaa');
					done();
				});
			});
		});


		describe('removeAllMembers', function() {

			it('should remove all members from a guild', function(done) {
				Guild.removeAllMembers(guildId, function(err) {
					expect(err).toBeFalsy();

					Guild.findById(guildId, function(err, guild) {
						expect(guild.members.length).toBe(0);
						done(err);
					});
				});
			});
		});
	});


	///////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////

	describe('removeMember', function() {

		var guildId, userId;

		beforeEach(function(done) {
			userId = mongoose.Types.ObjectId();
			guildId = 'geff';

			var guild = {
				_id: guildId,
				members: []
			};

			var user = {
				_id: userId,
				name: 'aaaa',
				site: 'j',
				group: 'u',
				siteUserId: 'abc'
			};

			User.create(user, function() {
				Guild.create(guild, function() {
					done();
				});
			});
		});

		afterEach(function() {
			mockgoose.reset();
		});


		it('should add a user to the guild', function(done) {
			Guild.addMember(guildId, userId, function(err) {
				Guild.findById(guildId, function(err, guild) {
					expect(guild.members[0].name).toBe('aaaa');
					done(err);
				});
			});
		});


		it('should set the users guild to this guilds id', function(done) {
			Guild.addMember(guildId, userId, function() {
				Guild.findById('geff', function(err, guild) {
					User.findById(userId, function(err, user){
						expect(user.guild).toBe('geff');
						done(err);
					});
				});
			});
		});
	});
});