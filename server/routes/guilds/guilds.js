(function() {

    'use strict';

    var Guild = require('../../models/guild');
    var _ = require('lodash');
    var saveBanner = require('../../fns/saveBanner');
    var paginate = require('../../fns/paginate');
    
    var checkUser = require('../../middleware/checkUser');
	var rateLimit = require('../../middleware/rateLimit');
	var continueSession = require('../../middleware/continueSession');
	var loadMyself = require('../../middleware/loadMyself');
	var isOwner = require('../../routes/guilds/middleware/isOwner');
	var loadGuild = require('../../routes/guilds/middleware/loadGuild');

    var self = {
        
        
        init: function(app) {
            app.get('/guilds', self.getList);
            app.put('/guilds/:guildId', continueSession, rateLimit('put:guild'), checkUser, loadMyself, self.put);
            app.get('/guilds/:guildId', loadGuild, self.get);
            app.del('/guilds/:guildId', loadGuild, continueSession, isOwner, self.del);
            app.post('/guilds/:guildId', loadGuild, continueSession, isOwner, self.post);
        },
        


        getList: function(req, res) {
            
            var data = {
                model: Guild,
                page: req.body.page,
                count: req.body.count,
                find: req.body.find,
                sort: req.body.sort,
                allowFindBy: ['join'],
                allowSortBy: ['_id', 'gpDay']
            };
            
            paginate(data, res.apiOut);
        },
        
        
        
        put: function(req, res) {
            var guildData = {_id: req.params.guildId, desc: req.body.desc, join: req.body.join};
            guildData.owners = [_.pick(req.session, '_id', 'name', 'site', 'group')];
            guildData.banner = {};

            // create the guild
            Guild.create(guildData, function(err, guild) {
                if(err) {
                    return res.apiOut(err);
                }

                // set myself as a member of this guild
                guild.addMember(req.myself._id, function(err) {
                    if(err) {
                        return res.apiOut(err);
                    }

                    // --> don't save a banner
                    if(!req.files || !req.files.bannerImg) {
                        return res.apiOut(null, guild);
                    }

                    // --> save a banner
                    saveBanner(guild, req.files.bannerImg, function(err) {
                        if(err) {
                            return res.apiOut(err);
                        }
                        return res.apiOut(null, guild);
                    });
                });
            });
        },
    
    
        post: function(req, res) {
            var guild = req.guild;
            guild.desc = req.body.desc;
            guild.join = req.body.join;

            guild.save(function(err) {
                if(err) {
                    return res.apiOut(err);
                }

                // --> don't save a banner
                if(!req.files || !req.files.bannerImg) {
                    return res.apiOut(null, guild);
                }

                // --> save a banner
                saveBanner(guild, req.files.bannerImg, function(err) {
                    if(err) {
                        return res.apiOut(err);
                    }
                    return res.apiOut(null, guild);
                });

            });
        },


        get: function(req, res) {
            res.apiOut(null, req.guild);
        },


        del: function(req, res) {
            req.guild.removeAllMembers(function(err) {
                if(err) {
                    return res.apiOut(err);
                }

                return req.guild.remove(function(err) {
                    if(err) {
                        res.apiOut(err);
                    }

                    return res.status(204).send();
                });
            });
        }
    };

    module.exports = self;
    
}());