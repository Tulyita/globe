(function() {
    
    'use strict';

	var rateLimit = require('../../middleware/rateLimit');
	var continueSession = require('../../middleware/continueSession');
    
    var invitationExists = require('./middleware/invitationExists');
    var isOwner = require('./middleware/isOwner');
    var isOwnerOrSelf = require('./middleware/isOwnerOrSelf');
    var isSelf = require('./middleware/isSelf');
    var loadGuild = require('./middleware/loadGuild');

    var self = {


        init: function (app) {
            app.get('/guilds/:guildId/invitations', loadGuild, self.getList);
            app.put('/guilds/:guildId/invitations/:userId', loadGuild, continueSession, rateLimit('put:invitation'), isOwner, self.put);
            app.get('/guilds/:guildId/invitations/:userId', loadGuild, invitationExists, self.get);
            app.post('/guilds/:guildId/invitations/:userId', loadGuild, continueSession, isSelf, invitationExists, self.post);
            app.del('/guilds/:guildId/invitations/:userId', loadGuild, continueSession, isOwnerOrSelf, invitationExists, self.del);
        },


        getList: function (req, res) {
            res.apiOut(null, req.guild.invitations);
        },


        put: function (req, res) {
            return req.guild.addUserToList('invitations', req.params.userId, function (err) {
                return res.apiOut(err, req.guild.getUserFrom('invitations', req.params.userId));
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