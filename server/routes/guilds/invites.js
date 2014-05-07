(function() {
    
    'use strict';

    var rateLimit = require('../../middleware/rateLimit');
    var continueSession = require('../../middleware/continueSession');
    var inviteExists = require('./middleware/inviteExists');
    var isOwner = require('./middleware/isOwner');
    var isOwnerOrSelf = require('./middleware/isOwnerOrSelf');
    var isSelf = require('./middleware/isSelf');
    var loadGuild = require('./middleware/loadGuild');

    var self = {


        init: function (app) {
            app.get('/guilds/:guildId/invites', loadGuild, self.getList);
            app.put('/guilds/:guildId/invites/:userId', loadGuild, continueSession, rateLimit('put:invite'), isOwner, self.put);
            app.get('/guilds/:guildId/invites/:userId', loadGuild, inviteExists, self.get);
            app.post('/guilds/:guildId/invites/:userId', loadGuild, continueSession, isSelf, inviteExists, self.post);
            app.del('/guilds/:guildId/invites/:userId', loadGuild, continueSession, isOwnerOrSelf, inviteExists, self.del);
        },


        getList: function (req, res) {
            res.apiOut(null, req.guild.invites);
        },


        put: function (req, res) {
            req.guild.addInvite(req.params.userId, res.apiOut);
        },


        post: function (req, res) {
            var action = req.body.action;
            if (action === 'accept') {
                return req.guild.acceptInvite(req.params.userId, res.apiOut);
            }

            return res.apiOut('Action "'+action+'" not found.');
        },


        get: function (req, res) {
            return res.apiOut(null, req.guild.getUserFrom('invites', req.params.userId));
        },


        del: function (req, res) {
            return req.guild.removeInvite(req.params.userId, function (err) {
                if (err) {
                    return res.apiOut(err);
                }
                return res.status(204).send();
            });
        }
    };

    module.exports = self;
    
}());