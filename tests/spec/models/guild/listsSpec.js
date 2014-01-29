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

		var guild, userId, userId2;

		beforeEach(function(done) {
			userId = mongoose.Types.ObjectId();
			userId2 = mongoose.Types.ObjectId();

			User.create({
				_id: userId,
				name: 'aaaa',
				site: 'j',
				group: 'u',
				siteUserId: 'abc',
				guild: 'cats'
			}, function(err) {
				if(err) {
					return done(err);
				}

				return Guild.create({
					_id: 'cats',
					members: [
						{_id: userId, name: 'aaaa', site: 'j', group: 'u'},
						{_id: userId2, name: 'bbbb', site: 'j', group: 'u'}
					]
				}, function(err, _guild_) {
					guild = _guild_;
					return done(err);
				});
			});
		});

		afterEach(function() {
			mockgoose.reset();
		});

		it('should remove a member from the members array', function(done) {
			return guild.removeMember(userId, function(err) {
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


		it('should remove a member from the array even if the user does not exist in the users collection', function(done) {
			guild.removeMember(userId2, function(err) {
				expect(guild.members.length).toBe(1);
				expect(guild.members[0].name).toBe('aaaa');
				done(err);
			});
		});


		describe('removeAllMembers', function() {

			it('should remove all members from a guild', function(done) {
				guild.removeAllMembers(function(err) {
					if(err) {
						return done(err);
					}

					expect(guild.members.length).toBe(0);
					return done(err);
				});
			});
		});
	});


	///////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////

	describe('removeMember', function() {

		var guild, userId;

		beforeEach(function(done) {
			userId = mongoose.Types.ObjectId();

			var user = {
				_id: userId,
				name: 'aaaa',
				site: 'j',
				group: 'u',
				siteUserId: 'abc'
			};

			User.create(user, function() {
				Guild.create({_id: 'cats'}, function(err, _guild_) {
					guild = _guild_;
					done(err);
				});
			});
		});

		afterEach(function() {
			mockgoose.reset();
		});


		it('should add a user to the guild', function(done) {
			guild.addMember(userId, function(err) {
				expect(guild.members[0].name).toBe('aaaa');
				done(err);
			});
		});


		it('should set the users guild to this guilds id', function(done) {
			guild.addMember(userId, function() {
				User.findById(userId, function(err, user){
					expect(user.guild).toBe('cats');
					done(err);
				});
			});
		});
	});
});