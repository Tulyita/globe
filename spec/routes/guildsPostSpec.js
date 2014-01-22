'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var User = require('../../server/models/user');
var Guild = require('../../server/models/guild');
var guildsPost = require('../../server/routes/guildsPost');

describe('guildsPost', function() {

	var session;
	var ownerId;

	beforeEach(function(done) {
		ownerId = mongoose.Types.ObjectId();
		session = {
			_id: ownerId,
			name: 'Sue',
			site: 'j',
			group: 'u'
		};

		Guild.create({
			_id: 'abc',
			join: Guild.OPEN,
			owners: [{
				_id: ownerId,
				name: 'bob',
				site: 'j',
				group: 'u'
			}]
		}, function(err) {
			done(err);
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('post', function() {

		it('should return an error if given an invalid action', function(done) {
			var req = {
				body: {
					action: 'hahaha'
				}
			};
			guildsPost.post(req, {apiOut: function(err) {
				expect(err).toBeTruthy();
				done();
			}});
		});
	});


	describe('createGuild', function() {

		it('should create a new guild', function(done) {
			var data = {
				guildId: 'turtle'
			};
			guildsPost.createGuild(data, session, function(err, res) {
				expect(err).toBeFalsy();
				expect(res._id).toEqual('turtle');
				expect(res.owners[0]._id).toEqual(session._id);
				expect(res.members[0]._id).toEqual(session._id);
				done();
			});
		});
	});
	
	
	describe('update', function() {

		it('should update an existing guild', function(done) {
			var data = {
				guildId: 'abc',
				join: Guild.ASK
			};
			guildsPost.updateGuild(data, {_id: ownerId}, function(err) {
				expect(err).toBeFalsy();

				Guild.findById('abc', function(err, doc) {
					expect(doc.join).toBe(Guild.ASK);
				});

				done();
			});
		});

		it('should not update if you are not an owner', function(done) {
			var data = {
				guildId: 'abc',
				join: Guild.ASK
			};
			session._id = mongoose.Types.ObjectId();
			guildsPost.updateGuild(data, session, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});

		it('should return an error of the guild does not exist', function(done) {
			var data = {
				guildId: 'zzz',
				join: Guild.ASK
			};
			guildsPost.updateGuild(data, session, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('addJoinRequest', function() {

		it('should forward request to Guild', function(done) {
			var data = {
				guildId: 'abc'
			};
			guildsPost.addJoinRequest(data, session, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});
	});


	describe('removeJoinRequest', function() {

		it('should forward request to Guild', function(done) {
			var data = {
				guildId: 'abc'
			};
			guildsPost.removeJoinRequest(data, session, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('addInvitation', function() {

		it('should forward request to Guild', function(done) {
			var data = {
				guildId: 'abc'
			};
			guildsPost.addInvitation(data, session, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});
	});


	describe('removeInvitation', function() {

		it('should forward request to Guild', function(done) {
			var data = {
				guildId: 'abc'
			};
			guildsPost.removeInvitation(data, session, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('acceptInvitation', function() {

		beforeEach(function(done) {
			session = {
				_id: mongoose.Types.ObjectId(),
				name: 'fi',
				site: 'j',
				group: 'u'
			};
			User.create({_id: session._id, name: session.name, site: session.site, group: session.group, siteUserId: 'site123'}, function(userErr) {
				Guild.create({_id: 'quark', invitations: [session]}, function(guildErr) {
					done(userErr || guildErr);
				});
			});
		});

		afterEach(function() {
			mockgoose.reset();
		});

		it('should remove an existing invitation and add user to guild', function(done) {
			var data = {
				guildId: 'quark'
			};
			guildsPost.acceptInvitation(data, session, function(err) {
				expect(err).toBeFalsy();

				Guild.findById('quark', function(err, guild) {
					expect(err).toBeFalsy();
					expect(guild.invitations.length).toBe(0);
					expect(guild.members.length).toBe(1);
					done();
				});
			});
		});
	});
});