'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var _ = require('lodash');
var Guild = require('../../../server/models/guild');
var User = require('../../../server/models/user');

describe('guild', function() {

	beforeEach(function() {
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('schema', function() {

		it('should accept valid values', function(done) {

			var obj = {};
			obj._id = 'birds';
			obj.join = Guild.INVITE;
			obj.createdDate = new Date(1);
			obj.activeDate = new Date(1);
			obj.hasBanner = true;
			obj.gp = 3;
			obj.gpDay = 3;
			obj.gpWeek = 3;
			obj.gpLifetime = 3;
			obj.owners = [];
			obj.members = [];
			obj.joinRequests = [];
			obj.invitations = [];

			Guild.create(obj, function(err, guild) {
				expect(err).toBeFalsy();

				expect(guild._id).toBe('birds');
				expect(guild.join).toBe(Guild.INVITE);
				expect(guild.createdDate).toEqual(new Date(1));
				expect(guild.activeDate).toEqual(new Date(1));
				expect(guild.hasBanner).toEqual(true);
				expect(guild.gp).toBe(3);
				expect(guild.gpDay).toBe(3);
				expect(guild.gpWeek).toBe(3);
				expect(guild.gpLifetime).toBe(3);
				expect(guild.owners.toObject()).toEqual([]);
				expect(guild.members.toObject()).toEqual([]);
				expect(guild.joinRequests.toObject()).toEqual([]);
				expect(guild.invitations.toObject()).toEqual([]);

				done();
			});
		});

		it('should return an error if a required field is invalid', function() {
			var obj = {
				_id: ''
			};
			Guild.create(obj, function(err) {
				expect(err).toMatch('Validator failed');
				expect(err).toMatch('_id');
			});
		});

		it('should replace non-required but invalid fields with a default', function(done) {
			var obj = {};
			obj._id = 'turtles';
			obj.join = {haxxor: true};
			obj.createdDate = {haxxor: true};
			obj.activeDate = {haxxor: true};
			obj.hasBanner = {haxxor: true};
			obj.gp = {haxxor: true};
			obj.gpDay = {haxxor: true};
			obj.gpWeek = {haxxor: true};
			obj.gpLifetime = {haxxor: true};
			obj.owners = {haxxor: true};
			obj.members = {haxxor: true};
			obj.joinRequests = {haxxor: true};
			obj.invitations = {haxxor: true};

			Guild.create(obj, function(err, guild) {

				expect(guild.join).toBe(Guild.INVITE);
				expect(_.isDate(guild.createdDate)).toBe(true);
				expect(_.isDate(guild.activeDate)).toBe(true);
				expect(guild.hasBanner).toBe(false);
				expect(guild.gp).toBe(0);
				expect(guild.gpDay).toBe(0);
				expect(guild.gpWeek).toBe(0);
				expect(guild.gpLifetime).toBe(0);
				expect(guild.owners.toObject()).toEqual([]);
				expect(guild.members.toObject()).toEqual([]);
				expect(guild.joinRequests.toObject()).toEqual([]);
				expect(guild.invitations.toObject()).toEqual([]);

				done(err);
			});
		});
	});



	describe('isOwner', function() {

		it('should return true if userId is in the list of owners', function() {
			var userId = mongoose.Types.ObjectId();
			var guild = new Guild();
			guild.owners = [{_id: userId, name: 'aaaa', site: 'j', group: 'u'}];
			expect(guild.isOwner(userId)).toBe(true);
		});

		it('should return false if userId is not in the list of owners', function() {
			var userId = mongoose.Types.ObjectId();
			var guild = new Guild();
			guild.owners = [];
			expect(guild.isOwner(userId)).toBe(false);
		});
	});


	describe('removeMember', function() {

		var userId, userId2;

		beforeEach(function(done) {
			userId = mongoose.Types.ObjectId();
			userId2 = mongoose.Types.ObjectId();

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
					_id: 'Happy Guild',
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
			Guild.findById('Happy Guild', function(err, guild) {
				if(err) {
					return done(err);
				}
				if(!guild) {
					return done('guild not found');
				}

				return guild.removeMember(userId, function(err) {
					if(err) {
						return done(err);
					}

					return Guild.findById('Happy Guild', function(err, guild) {
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
		});


		it('should return an error if the user is not in the member array', function(done) {
			Guild.findById('Happy Guild', function(err, guild) {
				if(err) {
					return done(err);
				}

				return guild.removeMember(mongoose.Types.ObjectId(), function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});


		it('should remove a member from the array even if the user does not exist in the users collection', function(done) {
			Guild.findById('Happy Guild', function(err, guild) {
				if(err) {
					return done(err);
				}

				return guild.removeMember(userId2, function(err) {
					expect(err).toBeFalsy();
					expect(guild.members.length).toBe(1);
					expect(guild.members[0].name).toBe('aaaa');
					done();
				});
			});
		});


		describe('removeAllMembers', function() {

			it('should remove all members from a guild', function(done) {
				Guild.findById('Happy Guild', function(err, guild) {
					if(err) {
						return done(err);
					}

					return guild.removeAllMembers(function(err) {
						expect(guild.members.length).toBe(0);
						done(err);
					});
				});
			});
		});
	});




	describe('removeMember', function() {

		var userId;

		beforeEach(function(done) {
			userId = mongoose.Types.ObjectId();

			var guild = {
				_id: 'geff',
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
			Guild.findById('geff', function(err, guild) {
				guild.addMember(userId, function(err) {
					expect(guild.members[0].name).toBe('aaaa');
					done(err);
				});
			});
		});


		it('should set the users guild to this guilds id', function(done) {
			Guild.findById('geff', function(err, guild) {
				guild.addMember(userId, function() {
					User.findById(userId, function(err, user){
						expect(user.guild).toBe('geff');
						done(err);
					});
				});
			});
		});
	});




	describe('addToJoinRequests', function() {

		it('should add a user', function(done) {
			var guildObj = {
				_id: 'sun',
				joinRequests: [],
				join: Guild.ASK
			};
			var user = {
				_id: mongoose.Types.ObjectId(),
				name: 'bob',
				site: 'j',
				group: 'u'
			};

			Guild.create(guildObj, function(err, guild) {
				guild.addJoinRequest(user, function(err) {
					expect(err).toBeFalsy();
					expect(guild.joinRequests.length).toBe(1);
					done();
				});
			});
		});

		it('should return an error if the user is already in joinRequests', function(done) {
			var user = {
				_id: mongoose.Types.ObjectId(),
				name: 'bob',
				site: 'j',
				group: 'u'
			};
			var guildObj = {
				_id: 'sun',
				joinRequests: [user]
			};

			Guild.create(guildObj, function(err, guild) {
				guild.addJoinRequest(user, function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});
	});



	describe('removeFromJoinRequests', function() {

		it('should remove a user', function(done) {
			var user = {
				_id: mongoose.Types.ObjectId(),
				name: 'bob',
				site: 'j',
				group: 'u'
			};
			var guildObj = {
				_id: 'sun',
				joinRequests: [user]
			};

			Guild.create(guildObj, function(err, guild) {
				guild.removeJoinRequest(user, function(err) {
					expect(err).toBeFalsy();
					expect(guild.joinRequests.length).toBe(0);
					done();
				});
			});
		});

		it('should return an error if the user is not in joinRequests', function(done) {
			var user = {
				_id: mongoose.Types.ObjectId(),
				name: 'bob',
				site: 'j',
				group: 'u'
			};
			var guildObj = {
				_id: 'sun',
				joinRequests: []
			};

			Guild.create(guildObj, function(err, guild) {
				guild.removeJoinRequest(user, function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});
	});



	describe('addToInvitations', function() {

		it('should add a user', function(done) {
			var user = {
				_id: mongoose.Types.ObjectId(),
				name: 'bob',
				site: 'j',
				group: 'u'
			};
			var guildObj = {
				_id: 'sun',
				invitations: []
			};

			Guild.create(guildObj, function(err, guild) {
				guild.addInvitation(user, function(err) {
					expect(err).toBeFalsy();
					expect(guild.invitations.length).toBe(1);
					done();
				});
			});
		});

		it('should return an error if the user is already in joinRequests', function(done) {
			var user = {
				_id: mongoose.Types.ObjectId(),
				name: 'bob',
				site: 'j',
				group: 'u'
			};
			var guildObj = {
				_id: 'sun',
				invitations: [user]
			};

			Guild.create(guildObj, function(err, guild) {
				guild.addInvitation(user, function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});
	});


	describe('removeFromInvitations', function() {

		it('should remove a user', function(done) {
			var user = {
				_id: mongoose.Types.ObjectId(),
				name: 'bob',
				site: 'j',
				group: 'u'
			};
			var guildObj = {
				_id: 'sun',
				invitations: [user]
			};

			Guild.create(guildObj, function(err, guild) {
				guild.removeInvitation(user, function(err) {
					expect(err).toBeFalsy();
					expect(guild.invitations.length).toBe(0);
					done();
				});
			});
		});

		it('should return an error if the user is not in joinRequests', function(done) {
			var user = {
				_id: mongoose.Types.ObjectId(),
				name: 'bob',
				site: 'j',
				group: 'u'
			};
			var guildObj = {
				_id: 'sun',
				invitations: []
			};

			Guild.create(guildObj, function(err, guild) {
				guild.removeInvitation(user, function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});
	});
});