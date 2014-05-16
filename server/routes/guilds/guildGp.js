(function() {
    
    'use strict';

    var _ = require('lodash');
    var loadGuild = require('./middleware/loadGuild');
    var memberExists = require('./middleware/memberExists');
    var checkServer = require('../../middleware/checkServer');


    var self = {


        init: function(app) {
            app.post('/guilds/:guildId/members/:userId/gp', checkServer, loadGuild, memberExists, self.post);
            app.get('/guilds/:guildId/members/:userId/gp', loadGuild, memberExists, self.get);
            app.get('/guilds/:guildId/gp', loadGuild, self.getGuildGp);
        },


        post: function(req, res) {
            req.guild.incGp(req.params.userId, Number(req.body.inc), function(err) {
                if(err) {
                    return res.apiOut(err);
                }

                var user = req.guild.getMember(req.params.userId);
                return res.apiOut(null, _.pick(user, 'gpDay', 'gpWeek', 'gpLife'));
            });
        },
        
        
        get: function(req, res) {
            var user = req.guild.getMember(req.params.userId);
            return res.apiOut(null, _.pick(user, 'gpDay', 'gpWeek', 'gpLife'));
        },
        
        
        getGuildGp: function(req, res) {
            return res.apiOut(null, _.pick(req.guild, 'gp', 'gpDay', 'gpWeek', 'gpLife'));
        }
    };
    
    
    module.exports = self;
    
}());