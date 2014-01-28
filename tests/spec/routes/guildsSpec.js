'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var sinon = require('sinon');
var Guild = require('../../../server/models/guild');
var User = require('../../../server/models/user');
var guilds = require('../../../server/routes/guilds/guild');

var guildData = require('../../data/guildData');
var userData = require('../../data/userData');
var userData2 = require('../../data/userData2');

describe('routes/guilds', function() {


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('get', function() {

		beforeEach(function() {
			sinon.stub(Guild, 'findById');
			Guild.findById
				.withArgs('abc')
				.yields(null, {_id: 'abc'});
			Guild.findById
				.withArgs('bla bla')
				.yields('oh my an error');
		});

		afterEach(function() {
			Guild.findById.restore();
		});


		it('should return a guild by id', function() {
			var req = {
				body: {
					guildId: 'abc'
				}
			};
			var res = {
				apiOut: sinon.stub()
			};
			guildRoutes.get(req, res);
			expect(res.apiOut.args[0]).toEqual([null, {_id: 'abc'}]);
		});


		it('should return an error for bad data', function() {
			var req = {
				body: {
					bla: 'bla bla'
				}
			};
			var res = {
				apiOut: sinon.stub()
			};
			guildRoutes.get(req, res);
			expect(res.apiOut.args[0]).toEqual(['Invalid guildId']);
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('post', function() {

		beforeEach(function() {
			sinon.stub(guildRoutes, 'performAction');
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
			guildRoutes.post(req, res);
			expect(res.apiOut.callCount).toBe(0);
			expect(guildRoutes.performAction.args[0]).toEqual(['ha', {action: 'ha', value: true}, {_id: '123'}, res.apiOut]);
		});

		afterEach(function() {
			guildRoutes.performAction.restore();
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('performAction', function() {

		beforeEach(function() {
			sinon.stub(Guild, 'findById')
				.withArgs('guildName').yields(null, {_id: 'guildName'})
				.withArgs('nonExistent').yields(null, null)
				.withArgs('bomb').yields('terrible error');
			sinon.stub(guildRoutes, 'createGuild');
			sinon.stub(guildRoutes, 'updateGuild');
		});

		it('should load a guild and call an action on it', function() {
			var action = 'updateGuild';
			var data = {guildId: 'guildName'};
			var session = {};
			var callback = sinon.spy();
			guildRoutes.performAction(action, data, session, callback);
			expect(callback.callCount).toBe(0);
			expect(guildRoutes.updateGuild.args[0]).toEqual([{_id: 'guildName'}, data, session, callback]);
		});

		it('should yield an error if a guild is not found and the action is not "createGuild"', function() {
			var action = 'updateGuild';
			var data = {guildId: 'nonExistent'};
			var session = {};
			var callback = sinon.spy();
			guildRoutes.performAction(action, data, session, callback);
			expect(callback.args[0]).toEqual(['Guild not found.']);
		});

		it('should yield an error if Guild yields an error', function() {
			var action = 'updateGuild';
			var data = {guildId: 'bomb'};
			var session = {};
			var callback = sinon.spy();
			guildRoutes.performAction(action, data, session, callback);
			expect(callback.args[0]).toEqual(['terrible error']);
		});

		afterEach(function() {
			Guild.findById.restore();
			guildRoutes.createGuild.restore();
			guildRoutes.updateGuild.restore();
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('createGuild', function() {

		beforeEach(function() {
			sinon.stub(Guild, 'create');
		});

		it('should yield an error if guild exists', function() {
			var guild = {};
			var data = {guildId: 'billies'};
			var session = {};
			var callback = sinon.stub();
			guildRoutes.createGuild(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['This guild name already exists.']);
		});

		it('should call Guild.create with passed in data and session data', function() {
			var userId = mongoose.Types.ObjectId();
			var guild = null;
			var data = {guildId: 'turtle'};
			var session = {_id: userId, name: 'paul', site: 'j', group: 'u'};
			var callback = sinon.stub();
			guildRoutes.createGuild(guild, data, session, callback);
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


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('setMod', function() {

		var data, owner, member, guild;

		beforeEach(function(done) {
			owner = userData2();
			member = userData();
			data = guildData();
			data.owners = [owner];
			data.members = [member];
			Guild.create(data, function(err, _guild_) {
				guild = _guild_;
				User.create(member, function(err) {
					done(err);
				});
			});
		});

		afterEach(function() {
			mockgoose.reset();
		});

		it('should change a members mod status in a guild', function(done) {
			var body = {
				userId: member._id,
				guildId: data._id,
				mod: true
			};
			var session = owner;
			guildRoutes.setMod(guild, body, session, function(err, res) {
				expect(res.members[0].mod).toBe(true);
				done(err);
			});
		});

		it('should yield an error if you are not an owner', function(done) {
			var body = {
				userId: member._id,
				guildId: data._id,
				mod: true
			};
			var session = member;
			guildRoutes.setMod(guild, body, session, function(err, res) {
				expect(err).toMatch('not an owner');
				done();
			});
		});

		it('should yield and error if the member does not exist', function(done) {
			var body = {
				userId: owner._id,
				guildId: data._id,
				mod: true
			};
			var session = owner;
			guildRoutes.setMod(guild, body, session, function(err, res) {
				expect(err).toMatch('Could not find');
				done();
			});
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('updateGuild', function() {

		var guild;

		beforeEach(function() {
			guild = {};
			guild.isOwner = sinon.stub();
			guild.isOwner.withArgs('aaa').returns(true);
			guild.isOwner.withArgs('bbb').returns(false);
			guild.save = sinon.stub();
		});

		afterEach(function() {
		});

		it('should update guild', function() {
			var data = {join: Guild.INVITE};
			var session = {_id: 'aaa'};
			var callback = sinon.stub();
			guildRoutes.updateGuild(guild, data, session, callback);
			expect(guild.join).toBe(Guild.INVITE);
			expect(guild.save.args[0]).toEqual([callback]);
		});

		it('should yield error if you are not an owner', function() {
			var data = {join: Guild.INVITE};
			var session = {_id: 'bbb'};
			var callback = sinon.stub();
			guildRoutes.updateGuild(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['You are not an owner of this guild.']);
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('addInvitation', function() {

		it('should forward request to Guild', function() {
			var guild = {
				addInvitation: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(true)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildRoutes.addInvitation(guild, data, session, callback);
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
			guildRoutes.addInvitation(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['You are not an owner of this guild.']);
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('removeInvitation', function() {

		it('should forward request to Guild', function() {
			var guild = {
				removeInvitation: sinon.stub()
			};
			var data = {};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildRoutes.removeInvitation(guild, data, session, callback);
			expect(guild.removeInvitation.args[0]).toEqual([{_id: '1'}, callback]);
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('acceptInvitation', function() {

		it('should remove the invitation and join the guild', function() {
			var guild = {
				removeInvitation: sinon.stub().yields(null),
				addMember: sinon.stub()
			};
			var data = {};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildRoutes.acceptInvitation(guild, data, session, callback);
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
			guildRoutes.acceptInvitation(guild, data, session, callback);
			expect(guild.removeInvitation.args[0][0]).toEqual({_id: '1'});
			expect(callback.args[0]).toEqual(['some error']);
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

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
			guildRoutes.deleteGuild(guild, data, session, callback);
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
			guildRoutes.deleteGuild(guild, data, session, callback);
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
			guildRoutes.deleteGuild(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['You are not an owner of this guild.']);
		});
	});
});