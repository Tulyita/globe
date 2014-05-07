(function() {
    
    'use strict';

    var _ = require('lodash');
    var rateLimit = require('../../middleware/rateLimit');
    var continueSession = require('../../middleware/continueSession');
    var loadUser = require('../../middleware/loadUser');
    var invitationExists = require('./middleware/invitationExists');
    var isOwner = require('./middleware/isOwner');
    var isOwnerOrSelf = require('./middleware/isOwnerOrSelf');
    var isSelf = require('./middleware/isSelf');
    var loadGuild = require('./middleware/loadGuild');

    var self = {


        init: function (app) {
            app.get('/guilds/:guildId/invitations', loadGuild, self.getList);
            app.put('/guilds/:guildId/invitations/:userId', loadGuild, continueSession, rateLimit('put:invitation'), isOwner, loadUser('guildInvitations'), self.put);
            app.get('/guilds/:guildId/invitations/:userId', loadGuild, invitationExists, self.get);
            app.post('/guilds/:guildId/invitations/:userId', loadGuild, continueSession, isSelf, invitationExists, loadUser('guildInvitations'), self.post);
            app.del('/guilds/:guildId/invitations/:userId', loadGuild, continueSession, isOwnerOrSelf, invitationExists, loadUser('guildInvitations'), self.del);
        },


        getList: function (req, res) {
            res.apiOut(null, req.guild.invitations);
        },


        put: function (req, res) {
            req.guild.addUserToList('invitations', req.params.userId, function (err) {
                if(err) {
                    return res.apitOut(err);
                }

                req.user.guildInvitations.push(req.params.guildId);
                req.user.guildInvitations = _.unique(req.user.guildInvitations);
                req.user.save(function(err) {
                    if(err) {
                        return res.apiOut(err);
                    }
                    return res.apiOut(null, req.guild.getUserFrom('invitations', req.params.userId));
                });
            });
        },


        post: function (req, res) {
            if (req.query.action === 'accept') {

                return req.guild.acceptInvitation(req.params.userId, function (err) {
                    if (err) {
                        return res.apiOut(err);
                    }

                    return res.apiOut(null, req.guild.getUserFrom('members', req.params.userId));
                });
            }

            return res.apiOut('Action not found.');
        },


        get: function (req, res) {
            return res.apiOut(null, req.guild.getUserFrom('invitations', req.params.userId));
        },


        del: function (req, res) {
            return req.guild.removeUserFromList('invitations', req.params.userId, function (err) {
                if (err) {
                    return res.apiOut(err);
                }
                return res.status(204).send();
            });
        }
    };

    module.exports = self;
    
}());