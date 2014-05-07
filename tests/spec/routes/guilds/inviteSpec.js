'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var invites = require('../../../../server/routes/guilds/invites');
var Guild = require('../../../../server/models/guild');
var User = require('../../../../server/models/user');

describe('routes/guilds/invite', function() {

	var userId, ownerId, invitedId, guild;

	beforeEach(function(done) {
		userId = mongoose.Types.ObjectId();
		ownerId = mongoose.Types.ObjectId();
		invitedId = mongoose.Types.ObjectId();
		Guild.create({_id: 'racers', invites: [{_id: invitedId, name: 'aaaa', site: 'j', group: 'u'}]}, function(err, _guild_) {
			guild = _guild_;
			User.create({_id: invitedId, name: 'aaaa', site: 'j', group: 'u', siteUserId: '123'}, function(err2) {
				User.create({_id: userId, name: 'bbbb', site: 'j', group: 'u', siteUserId: '124'}, function(err3) {
					done(err || err2 || err3);
				});
			});
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});
    
    
    
    
    
    describe('routes/guilds/invites', function() {

        var guild;

        beforeEach(function(done) {
            Guild.create({_id: 'racers', invites: [{_id: mongoose.Types.ObjectId(), name: 'aaaa', site: 'j', group: 'u'}]}, function(err, _guild_) {
                guild = _guild_;
                done(err);
            });
        });

        afterEach(function() {
            mockgoose.reset();
        });

        describe('get', function() {

            it('should return a list of invites', function(done) {
                var req = {
                    params: {
                        guildId: 'racers'
                    },
                    guild: guild
                };
                invites.get(req, {apiOut: function(err, res) {
                    expect(res.length).toBe(1);
                    expect(res[0].name).toBe('aaaa');
                    done(err);
                }});
            });
        });
    });
    
    
    
    

	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('put', function() {

		it('should put an invite', function(done) {
			var req = {
				session: {
					userId: ownerId
				},
				params: {
					guildId: 'racer',
					userId: userId
				},
				guild: guild
			};
			invites.put(req, {apiOut: function(err, res) {
				expect(res._id).toEqual(userId);
				expect(guild.invites[1]._id).toEqual(userId);
				done(err);
			}});
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('post', function() {

		it('should accept an invite', function(done) {
			var req = {
				params: {
					guildId: 'racer',
					userId: invitedId
				},
				query: {
					action: 'accept'
				},
				guild: guild
			};
			invites.post(req, {apiOut: function(err, res) {
				expect(res).toBeFalsy();
				expect(guild.invites.length).toEqual(0);
				done(err);
			}});
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('get', function() {

		it('should get an invite', function(done) {
			var req = {
				params: {
					guildId: 'racer',
					userId: invitedId
				},
				guild: guild
			};
			invites.get(req, {apiOut: function(err, res) {
				expect(res._id).toEqual(invitedId);
				done(err);
			}});
		});
	});


	////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////

	describe('del', function() {

		it('should delete an invite', function(done) {
			var req = {
				params: {
					guildId: 'racer',
					userId: invitedId
				},
				guild: guild
			};
			invites.del(req, {status: function(code) {
				expect(code).toEqual(204);
				return {send: function(msg) {
					expect(msg).toBeFalsy();
					expect(guild.invites.length).toBe(0);
					done();
				}};
			}});
		});
	});
});