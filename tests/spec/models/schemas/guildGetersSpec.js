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
			invites: []
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
			expect(guild.getMember(user1._id).toObject()._id).toEqual(user1._id);
		});

		it('should return false if user is not in members array', function() {
			expect(guild.getMember(user1._id)).toBeFalsy();
		});
	});


	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	describe('isGuildMod', function() {

		it('should return true if user is in members array and user.mod is true', function() {
			user1.mod = true;
			guild.members = [user1];
			expect(guild.getGuildMod(user1._id).toObject()._id).toEqual(user1._id);
		});

		it('should return false if user is not in members array', function() {
			expect(guild.getGuildMod(user1._id)).toBeFalsy();
		});
	});


	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	describe('isOwner', function() {

		it('should return true if user is in owners array', function() {
			guild.owners = [user1];
			expect(guild.getOwner(user1._id).toObject()).toEqual(user1);
		});

		it('should return false if user is not in owners array', function() {
			expect(guild.getOwner(user1._id)).toBeFalsy();
		});
	});


	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	describe('isInvited', function() {

		it('should return true if user is in invites array', function() {
			guild.invites = [user1];
			expect(guild.getInvite(user1._id).toObject()).toEqual(user1);
		});

		it('should return false if user is not in invites array', function() {
			expect(guild.getInvite(user1._id)).toBeFalsy();
		});
	});


	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	describe('isRequester', function() {

		it('should return true if user is in joinRequests array', function() {
			guild.applicants = [user1];
			expect(guild.getApplicant(user1._id).toObject()).toEqual(user1);
		});

		it('should return false if user is not in joinRequests array', function() {
			expect(guild.getApplicant(user1._id)).toBeFalsy();
		});
	});


	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	describe('isKicked', function() {
		it('should return true if user is in kicks array', function() {
			guild.kicks = [user1];
			expect(guild.getKick(user1._id).toObject()).toEqual(user1);
		});

		it('should return false if user is not in kicks array', function() {
			expect(guild.getKick(user1._id)).toBeFalsy();
		});
	});
});