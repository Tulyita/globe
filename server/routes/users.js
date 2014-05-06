'use strict';

var banFns = require('../fns/banFns');
var permissions = require('../fns/permissions');
var paginate = require('../fns/paginate');
var Guild = require('../models/guild');
var User = require('../models/user');
var _ = require('lodash');

var continueSession = require('../middleware/continueSession');
var loadUser = require('../middleware/loadUser');

var self = {
    
    
    /*
     * set paths and middleware
     */
    init: function(app) {
        app.get('/users', self.getList);
        app.get('/users/:userId', continueSession, loadUser(), self.getUser);
    },
    
    
    /**
     * get a paginated list of users
     */
    getList: function(req, res) {
        var options = {
			page: req.body.page,
			count: req.body.count,
			model: User
		};
		return paginate(options, res.apiOut);
    },

    
    /**
     * get a particular user
     */
    getUser: function (req, res) {

        var user = req.user;
        var obj = user.publicData();

        // add bans if they were requested
        if (req.param('bans')) {
            obj.bans = _.map(user.bans, function (ban) {
                return _.pick(ban, '_id', 'type', 'mod', 'expireDate', 'date', 'reason', 'publicInfo');
            });
            obj.ban = banFns.findActiveBan(obj.bans);
        }

        // just return the data if you are not logged in
        if (!req.session._id) {
            return (res.apiOut(null, obj));
        }

        // return data + permissions only if you are logged in
        User.findById(req.session._id, function (err, me) {
            if (!me) {
                return (res.apiOut(null, obj));
            }

            obj.actions = {
                message: permissions.iCanMessage(me, user),
                apprentice: permissions.iCanApprentice(me, user),
                deApprentice: permissions.iCanDeApprentice(me, user),
                mod: permissions.iCanMod(me, user),
                deMod: permissions.iCanDeMod(me, user),
                ban: permissions.iCanBan(me, user),
                deBan: permissions.iCanDeBan(me, user),
                report: permissions.iCanReport(me, user)
            };

            if (me.guild) {
                return Guild.findById(me.guild, function (err, guild) {
                    if (guild) {
                        obj.actions.invite = permissions.iCanGuildInvite(me, user, guild);
                        obj.actions.deInvite = permissions.iCanDeGuildInvite(me, user, guild);
                        obj.actions.guildMod = permissions.iCanGuildMod(me, user, guild);
                        obj.actions.deGuildMod = permissions.iCanDeGuildMod(me, user, guild);
                        obj.actions.kick = permissions.iCanKick(me, user, guild);
                        obj.actions.deKick = permissions.iCanDeKick(me, user, guild);
                    }
                    console.log('loaded guild', err, guild);
                    return res.apiOut(null, obj);
                });
            } else {
                return res.apiOut(null, obj);
            }
        });
    }
};


module.exports = self;