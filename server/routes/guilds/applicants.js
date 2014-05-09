(function() {

    'use strict';
    
    var rateLimit = require('../../middleware/rateLimit');
    var continueSession = require('../../middleware/continueSession');
    var applicantExists = require('./middleware/applicantExists');
    var isOwner = require('./middleware/isOwner');
    var isOwnerOrSelf = require('./middleware/isOwnerOrSelf');
    var isSelf = require('./middleware/isSelf');
    var loadGuild = require('./middleware/loadGuild');
    

    var self = {
        
        
        init: function(app) {
            app.get('/guilds/:guildId/applicants', loadGuild, self.getList);
            app.put('/guilds/:guildId/applicants/:userId', loadGuild, continueSession, rateLimit('put:applicant'), isSelf, self.put);
            app.post('/guilds/:guildId/applicants/:userId', loadGuild, continueSession, isOwner, applicantExists, self.post);
            app.get('/guilds/:guildId/applicants/:userId', loadGuild, applicantExists, self.get);
            app.del('/guilds/:guildId/applicants/:userId', loadGuild, continueSession, isOwnerOrSelf, applicantExists, self.del);
        },


        getList: function (req, res) {
            res.apiOut(null, req.guild.applicants);
        },


        put: function (req, res) {
            return req.guild.addUserToList('applicants', req.session._id, function (err) {
                return res.apiOut(err, req.guild.getUserFrom('applicants', req.params.userId));
            });
        },


        post: function (req, res) {
            if (req.body.action === 'accept') {

                return req.guild.acceptApplication(req.params.userId, function (err) {
                    if (err) {
                        return res.apiOut(err);
                    }

                    return res.apiOut(null, req.guild.getUserFrom('members', req.params.userId));
                });
            }

            return res.apiOut('Invalid action.');
        },


        get: function (req, res) {
            var user = req.guild.getUserFrom('applicants', req.params.userId);
            return res.apiOut(null, user);
        },


        del: function (req, res) {
            return req.guild.removeUserFromList('applicants', req.params.userId, function (err) {
                if (err) {
                    return res.apiOut(err);
                }
                return res.status(204).send();
            });
        }
    };

    module.exports = self;
    
}());