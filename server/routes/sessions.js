(function() {
    
    /**
     * Create a session for a user based on their login status with other sites
     * Returns a token that can be used to continue this session for future requests
     */


    'use strict';

    var _ = require('lodash');
    var session = require('../fns/redisSession');
    var User = require('../models/user');
    var IpBan = require('../models/ipBan');
    var authServices = require('../fns/auth/authServices');
    var continueSession = require('../middleware/continueSession');
    
    
    
    
    
    
    
    
    
    /**
     * Prevent frequent offenders from logging in
     * @param {string} ip
     * @param {Function} callback
     */
    var checkIpBan = function(ip, callback) {
        IpBan.find({ip: ip}, function(err, ipBans) {
            if(err) {
                return callback('Could not check ip bans.');
            }
            if(ipBans.length >= 3) {
                return callback('This ip address has been temporarily blocked due to frequent abuse.');
            }
            return callback(null);
        });
    };


    /**
     * Save new user to mongo, or update an existing one
     * @param {Object} verified
     * @param {string} ip
     * @param {Function} callback
     */
    var saveUser = function(verified, ip, callback) {
        verified.ip = ip;
        verified.loginDate = new Date();
        User.findOneAndSave({site: verified.site, siteUserId: verified.siteUserId}, verified, function(err, user) {
            if(err) {
                return callback(err);
            }

            return callback(null, user);
        });
    };


    /**
     * Make changes to a user
     * @param user
     * @param callback
     * @returns {*}
     */
    var processUser = function(user, callback) {
        var ban = findActiveBan(user.bans);
        if(ban) {
            if(ban.type === 'ban') {
                return callback({code: 403, _id: user._id, ban: ban, message: 'This account has been banned until ' + ban.expireDate + '. Reason: ' + ban.reason});
            }
            if(ban.type === 'silence') {
                user.silencedUntil = ban.expireDate;
            }
        }
        if(process.env.NODE_ENV === 'staging' && !user.beta) {
            return callback({code: 403, message: 'This server can only be accessed by beta testers.'});
        }
        return callback(null);
    };

    
    
    /**
     * Create a session for a user
     * @param user
     * @param callback
     */
    var startSession = function(user, callback) {
        user._id = String(user._id);
        session.make(user._id, _.pick(user, '_id', 'name', 'site', 'group', 'silencedUntil', 'guild'), function(err, response, token) {
            if(err) {
                return callback(err);
            }
            return callback(null, token);
        });
    };

    
    
    /**
     * Find the newest ban of a certain type
     * @param bans
     * @param type
     * @returns {Ban}
     */
    var findNewestBan = function(bans, type) {
        var newestBan = null;
        _.each(bans, function(ban) {
            if(ban.type === type && (!newestBan || newestBan.expireDate < ban.date)) {
                newestBan = ban;
            }
        });
        return newestBan;
    };
    
    

    /**
     * Look through all the bans on a user and return the active one if it exists
     * @param bans
     * @returns {Ban}
     */
    var findActiveBan = function(bans) {
        var silence = findNewestBan(bans, 'silence');
        var ban = findNewestBan(bans, 'ban');
        if(ban && ban.expireDate > new Date()) {
            return ban;
        }
        if(silence && silence.expireDate > new Date()) {
            return silence;
        }
        return null;
    };



    
    
    
    
    
    


    var self = {

        init: function(app) {
            app.post('/sessions', self.post);
            app.del('/sessions/:token', continueSession, self.del);
            app.get('/sessions/:token', continueSession, self.get);
        },
        
        
        /**
         * Go through all of the steps required to make a session
         * @param req
         * @param res
         * @returns {*}
         */
        post: function(req, res) {

            checkIpBan(req.ip, function(err) {
                if(err) {
                    return res.apiOut(err);
                }

                return authServices.authenticate(req.body, req.ip, function(err, verified) {
                    if(err) {
                        return res.apiOut(err);
                    }

                    return saveUser(verified, req.ip, function(err, user) {
                        if(err) {
                            return res.apiOut(err);
                        }

                        return processUser(user, function(err) {
                            if(err) {
                                return res.apiOut(err);
                            }

                            return startSession(user, function(err, token) {
                                if(err) {
                                    return res.apiOut(err);
                                }

                                var obj = _.pick(user, '_id', 'name', 'site', 'group', 'silencedUntil', 'guild');
                                obj.token = token;
                                return res.apiOut(null, obj);
                            });
                        });
                    });
                });
            });
        },
        
        
        /**
         * Delete a token
         * @param req
         * @param res
         */
        del: function(req, res) {
            var token = req.session.token || req.params.token;
            return session.destroy(token, res.apiOut);
        },


        /**
         *
         * @param req
         * @param res
         */
        get: function(req, res) {
            var token = req.params.token;
            session.get(token, function(err, result) {
                if(err) {
                    return res.apiOut({code: 404, message: err});
                }
                res.apiOut(null, result);
            });
        }
    
    
    };



    module.exports = self;
    
}());