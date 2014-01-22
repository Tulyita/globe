'use strict';

var mongoose = require('mongoose');
var sinon = require('sinon');
var User = require('../../server/models/user');
var Guild = require('../../server/models/guild');
var guildsPost = require('../../server/routes/guildsPost');

describe('guildsPost', function() {


	describe('post', function() {

		beforeEach(function() {
			sinon.stub(guildsPost, 'performAction');
		});

		it('should pass data on to function performAction', function() {
			var req = {
				body: {
					action: 'ha',
					value: true
				},
				session: {
					_id: '123'
				}
			};
			var res = {
				apiOut: sinon.stub()
			};
			guildsPost.post(req, res);
			expect(res.apiOut.callCount).toBe(0);
			expect(guildsPost.performAction.args[0]).toEqual(['ha', {action: 'ha', value: true}, {_id: '123'}, res.apiOut]);
		});

		afterEach(function() {
			guildsPost.performAction.restore();
		});
	});


	describe('performAction', function() {

		beforeEach(function() {
			sinon.stub(Guild, 'findById')
				.withArgs('guildName').yields(null, {_id: 'guildName'})
				.withArgs('nonExistent').yields(null, null)
				.withArgs('bomb').yields('terrible error');
			sinon.stub(guildsPost, 'createGuild');
			sinon.stub(guildsPost, 'updateGuild');
		});

		it('should load a guild and call an action on it', function() {
			var action = 'updateGuild';
			var data = {guildId: 'guildName'};
			var session = {};
			var callback = sinon.spy();
			guildsPost.performAction(action, data, session, callback);
			expect(callback.callCount).toBe(0);
			expect(guildsPost.updateGuild.args[0]).toEqual([{_id: 'guildName'}, data, session, callback]);
		});

		it('should yield an error if a guild is not found and the action is not "createGuild"', function() {
			var action = 'updateGuild';
			var data = {guildId: 'nonExistent'};
			var session = {};
			var callback = sinon.spy();
			guildsPost.performAction(action, data, session, callback);
			expect(callback.args[0]).toEqual(['Guild not found.']);
		});

		it('should yield an error if Guild yields an error', function() {
			var action = 'updateGuild';
			var data = {guildId: 'bomb'};
			var session = {};
			var callback = sinon.spy();
			guildsPost.performAction(action, data, session, callback);
			expect(callback.args[0]).toEqual(['terrible error']);
		});

		afterEach(function() {
			Guild.findById.restore();
			guildsPost.createGuild.restore();
			guildsPost.updateGuild.restore();
		});
	});


	describe('createGuild', function() {

		beforeEach(function() {
			sinon.stub(Guild, 'create');
		});

		it('should yield an error if guild exists', function() {
			var guild = {};
			var data = {guildId: 'billies'};
			var session = {};
			var callback = sinon.stub();
			guildsPost.createGuild(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['This guild name already exists.']);
		});

		it('should call Guild.create with passed in data and session data', function() {
			var userId = mongoose.Types.ObjectId();
			var guild = null;
			var data = {guildId: 'turtle'};
			var session = {_id: userId, name: 'paul', site: 'j', group: 'u'};
			var callback = sinon.stub();
			guildsPost.createGuild(guild, data, session, callback);
			expect(callback.callCount).toBe(0);
			expect(Guild.create.args[0]).toEqual([{
				_id: 'turtle',
				owners: [{_id: userId, name: 'paul', site: 'j', group: 'u'}],
				members: [{_id: userId, name: 'paul', site: 'j', group: 'u', mod: true}]
			}, callback]);
		});

		afterEach(function() {
			Guild.create.restore();
		});
	});
	
	
	describe('updateGuild', function() {

		var guild;

		beforeEach(function() {
			guild = {};
			guild.isOwner = sinon.stub();
			guild.isOwner.withArgs('aaa').returns(true);
			guild.isOwner.withArgs('bbb').returns(false);
			guild.save = sinon.stub()
		});

		it('should update guild', function() {
			var data = {join: Guild.INVITE};
			var session = {_id: 'aaa'};
			var callback = sinon.stub();
			guildsPost.updateGuild(guild, data, session, callback);
			expect(guild.join).toBe(Guild.INVITE);
			expect(guild.save.args[0]).toEqual([callback]);
		});

		it('should yield error if you are not an owner', function() {
			var data = {join: Guild.INVITE};
			var session = {_id: 'bbb'};
			var callback = sinon.stub();
			guildsPost.updateGuild(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['You are not an owner of this guild.']);
		});

		afterEach(function() {
		});
	});


	describe('addJoinRequest', function() {

		it('should forward request to Guild', function() {
			var guild = {
				addJoinRequest: sinon.stub()
			};
			var data = {};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildsPost.addJoinRequest(guild, data, session, callback);
			expect(guild.addJoinRequest.args[0]).toEqual([{_id: '1'}, callback]);
		});
	});


	describe('removeJoinRequest', function() {

		it('should forward request to Guild', function() {
			var guild = {
				removeJoinRequest: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(true)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildsPost.removeJoinRequest(guild, data, session, callback);
			expect(guild.removeJoinRequest.args[0]).toEqual([{_id: '2'}, callback]);
		});

		it('should yield false if you are not an owner', function() {
			var guild = {
				removeJoinRequest: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(false)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildsPost.removeJoinRequest(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['You are not an owner of this guild.']);
		});
	});


	describe('acceptJoinRequest', function() {

		it('should call guild.removeJoinRequest, then guild.addMember', function() {
			var guild = {
				removeJoinRequest: sinon.stub().yields(null),
				addMember: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(true)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildsPost.acceptJoinRequest(guild, data, session, callback);
			expect(guild.removeJoinRequest.args[0][0]).toEqual({_id: '2'});
			expect(guild.addMember.args[0]).toEqual(['2', callback]);
		});

		it('should yield an error if guild.removeJoinRequest yields an error', function() {
			var guild = {
				removeJoinRequest: sinon.stub().yields('an error'),
				addMember: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(true)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildsPost.acceptJoinRequest(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['an error']);
		});

		it('should yield an error if you are not the owner', function() {
			var guild = {
				removeJoinRequest: sinon.stub().returns('an error'),
				addMember: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(false)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildsPost.acceptJoinRequest(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['You are not an owner of this guild.']);
		});
	});


	describe('addInvitation', function() {

		it('should forward request to Guild', function() {
			var guild = {
				addInvitation: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(true)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildsPost.addInvitation(guild, data, session, callback);
			expect(guild.addInvitation.args[0]).toEqual([{_id: '2'}, callback]);
		});

		it('should yield false if you are not an owner', function() {
			var guild = {
				addInvitation: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(false)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildsPost.addInvitation(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['You are not an owner of this guild.']);
		});
	});


	describe('removeInvitation', function() {

		it('should forward request to Guild', function() {
			var guild = {
				removeInvitation: sinon.stub()
			};
			var data = {};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildsPost.removeInvitation(guild, data, session, callback);
			expect(guild.removeInvitation.args[0]).toEqual([{_id: '1'}, callback]);
		});
	});


	describe('acceptInvitation', function() {

		it('should remove the invitation and join the guild', function() {
			var guild = {
				removeInvitation: sinon.stub().yields(null),
				addMember: sinon.stub()
			};
			var data = {};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildsPost.acceptInvitation(guild, data, session, callback);
			expect(guild.removeInvitation.args[0][0]).toEqual({_id: '1'});
			expect(guild.addMember.args[0]).toEqual(['1', callback]);
		});

		it('should yield an error if Guild.removeInvitation yields an error', function() {
			var guild = {
				removeInvitation: sinon.stub().yields('some error'),
				addMember: sinon.stub()
			};
			var data = {};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildsPost.acceptInvitation(guild, data, session, callback);
			expect(guild.removeInvitation.args[0][0]).toEqual({_id: '1'});
			expect(callback.args[0]).toEqual(['some error']);
		});
	});


	describe('deleteGuild', function() {

		it('should call guild.removeAllMembers, then guild.remove', function() {
			var guild = {
				isOwner: sinon.stub().withArgs('55').returns(true),
				removeAllMembers: sinon.stub().yields(null),
				remove: sinon.stub()
			};
			var data = {};
			var session = {_id: '55'};
			var callback = sinon.stub();
			guildsPost.deleteGuild(guild, data, session, callback);
			expect(guild.removeAllMembers.callCount).toBe(1);
			expect(guild.remove.callCount).toBe(1);
		});

		it('should yield and error if guild.removeAllMembers yields an error', function() {
			var guild = {
				isOwner: sinon.stub().withArgs('55').returns(true),
				removeAllMembers: sinon.stub().yields('ouch that hurts'),
				remove: sinon.stub()
			};
			var data = {};
			var session = {_id: '55'};
			var callback = sinon.stub();
			guildsPost.deleteGuild(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['ouch that hurts']);
		});

		it('should yield an error if you are not an owner', function() {
			var guild = {
				isOwner: sinon.stub().withArgs('55').returns(false),
				removeAllMembers: sinon.stub().yields('ouch that hurts'),
				remove: sinon.stub()
			};
			var data = {};
			var session = {_id: '55'};
			var callback = sinon.stub();
			guildsPost.deleteGuild(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['You are not an owner of this guild.']);
		});
	});
});