'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Guild = require('../../../../server/models/guild');

describe('guild/auth', function() {

	var guild, user1, user2;

	beforeEach(function(done) {
		Guild.create({
			_id: 'ggg',
			owners: [],
			members: [],
			kicks: [],
			joinRequests: [],
			invitations: []
		}, function(err, _guild_){
			guild = _guild_;
			done(err);
		});

		user1 = {
			_id: mongoose.Types.ObjectId(),
			name: 'Ben',
			site: 'j',
			group: 'u'
		};

		user2 = {
			_id: mongoose.Types.ObjectId(),
			name: 'Ben',
			site: 'j',
			group: 'u'
		};
	});

	afterEach(function() {
		mockgoose.reset();
	});

	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	describe('isMember', function() {

		it('should return true if user is in members array', function() {
			guild.members = [user1];
			expect(guild.isMember(user1._id)).toBe(true);
		});

		it('should return false if user is not in members array', function() {
			expect(guild.isMember(user1._id)).toBe(false);
		});
	});


	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	describe('isGuildMod', function() {

		it('should return true if user is in members array and user.mod is true', function() {
			user1.mod = true;
			guild.members = [user1];
			expect(guild.isGuildMod(user1._id)).toBe(true);
		});

		it('should return false if user is not in members array', function() {
			expect(guild.isGuildMod(user1._id)).toBe(false);
		});
	});


	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	describe('isOwner', function() {

		it('should return true if user is in owners array', function() {
			guild.owners = [user1];
			expect(guild.isOwner(user1._id)).toBe(true);
		});

		it('should return false if user is not in owners array', function() {
			expect(guild.isOwner(user1._id)).toBe(false);
		});
	});


	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	describe('isInvited', function() {

		it('should return true if user is in invitations array', function() {
			guild.invitations = [user1];
			expect(guild.isInvited(user1._id)).toBe(true);
		});

		it('should return false if user is not in invitations array', function() {
			expect(guild.isInvited(user1._id)).toBe(false);
		});
	});


	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	describe('isRequester', function() {

		it('should return true if user is in joinRequests array', function() {
			guild.joinRequests = [user1];
			expect(guild.isRequester(user1._id)).toBe(true);
		});

		it('should return false if user is not in joinRequests array', function() {
			expect(guild.isRequester(user1._id)).toBe(false);
		});
	});


	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	describe('isKicked', function() {
		it('should return true if user is in kicks array', function() {
			guild.kicks = [user1];
			expect(guild.isKicked(user1._id)).toBe(true);
		});

		it('should return false if user is not in kicks array', function() {
			expect(guild.isKicked(user1._id)).toBe(false);
		});
	});
});