'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var _ = require('lodash');
var Guild = require('../../server/models/guild');
var User = require('../../server/models/user');
var obj;

describe('guild', function() {

	beforeEach(function() {
		obj = {
			_id: 'best guild!'
		};
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('_id', function() {

		it('should accept a valid name', function(done) {
			obj._id = 'birds';
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc._id).toBe('birds');
				done();
			});
		});

		it('should not accept an invalid name', function(done) {
			obj._id = '';
			Guild.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('join', function() {

		it('should accept inviteOnly', function(done) {
			obj.join = Guild.INVITE;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.join).toBe(Guild.INVITE);
				done();
			});
		});

		it('should accept requestToJoin', function(done) {
			obj.join = Guild.ASK;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.join).toBe(Guild.ASK);
				done();
			});
		});

		it('should accept allWelcome', function(done) {
			obj.join = Guild.OPEN;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.join).toBe(Guild.OPEN);
				done();
			});
		});

		it('should use default if given an invalid value', function(done) {
			obj.join = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.join).toBe(Guild.INVITE);
				done();
			});
		});
	});


	describe('createdDate', function() {
		it('should accept a valid date', function(done) {
			obj.createdDate = new Date(1);
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.createdDate).toEqual(new Date(1));
				done();
			});
		});

		it('should replace invalid date with default', function(done) {
			obj.createdDate = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(_.isDate(doc.createdDate)).toBeTruthy();
				done();
			});
		});
	});


	describe('activeDate', function() {
		it('should accept a valid date', function(done) {
			obj.activeDate = new Date(1);
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.activeDate).toEqual(new Date(1));
				done();
			});
		});

		it('should replace invalid date with default', function(done) {
			obj.activeDate = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(_.isDate(doc.activeDate)).toBeTruthy();
				done();
			});
		});
	});


	describe('hasBanner', function() {
		it('should accept a valid boolean', function(done) {
			obj.hasBanner = true;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.hasBanner).toEqual(true);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.hasBanner = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.hasBanner).toBe(false);
				done();
			});
		});
	});


	describe('gp', function() {
		it('should accept a valid value', function(done) {
			obj.gp = 3;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.gp).toBe(3);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.gp = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.gp).toBe(0);
				done();
			});
		});
	});


	describe('gpDay', function() {
		it('should accept a valid value', function(done) {
			obj.gpDay = 3;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.gpDay).toBe(3);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.gpDay = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.gpDay).toBe(0);
				done();
			});
		});
	});


	describe('gpWeek', function() {
		it('should accept a valid value', function(done) {
			obj.gpWeek = 3;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.gpWeek).toBe(3);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.gpWeek = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.gpWeek).toBe(0);
				done();
			});
		});
	});


	describe('gpLifetime', function() {
		it('should accept a valid value', function(done) {
			obj.gpLifetime = 3;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.gpLifetime).toBe(3);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.gpLifetime = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.gpLifetime).toBe(0);
				done();
			});
		});
	});


	describe('invitations', function() {
		it('should accept an empty array', function(done) {
			obj.owners = [];
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.owners.toObject()).toEqual([]);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.owners = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.owners.toObject()).toEqual([]);
				done();
			});
		});
	});


	describe('members', function() {
		it('should accept an empty array', function(done) {
			obj.members = [];
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.members.toObject()).toEqual([]);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.members = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.members.toObject()).toEqual([]);
				done();
			});
		});
	});


	describe('joinRequests', function() {
		it('should accept an empty array', function(done) {
			obj.joinRequests = [];
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.joinRequests.toObject()).toEqual([]);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.joinRequests = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.joinRequests.toObject()).toEqual([]);
				done();
			});
		});
	});


	describe('invitations', function() {
		it('should accept an empty array', function(done) {
			obj.invitations = [];
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.invitations.toObject()).toEqual([]);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.invitations = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.invitations.toObject()).toEqual([]);
				done();
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
				guild.addMember(userId, function(err) {
					User.findById(userId, function(err, user){
						expect(user.guild).toBe('geff');
						done(err);
					});
				});
			});
		});
	});
});