(function() {
    
    'use strict';

    var _ = require('lodash');
    var async = require('async');
    var User = require('../user');
    var redisSession = require('../../fns/redisSession');

    module.exports = function (schema) {


        
        /**
         * Remove all of the members from this guild
         * @param {Function} callback
         */
        schema.methods.removeAllMembers = function (callback) {
            var self = this;
            var members = _.clone(this.members);

            var iterator = function (member, cb) {
                User.update({
                    _id: member._id,
                    guild: self._id
                }, {
                    $unset: {
                        guild: ''
                    }
                }, cb);
            };

            async.eachSeries(members, iterator, function (err) {
                if (err) {
                    return callback(err);
                }

                self.members = [];
                return self.save(callback);
            });
        };


        
        /**
         * Add a user to this guild
         * @param {ObjectId} userId
         * @param {Function} callback
         */
        schema.methods.addMember = function (userId, callback) {
            var self = this;

            // load the user
            User.findExistingById(userId, 'guild', function (err, user) {
                if (err) {
                    return callback(err);
                }

                // --> async branch to remove user from old guild
                if (user.guild && user.guild !== self._id) {
                    var Guild = require('../guild'); // import guild here to avoid circular dependency
                    Guild.findById(user.guild, function (err, oldGuild) {
                        if (oldGuild) {
                            oldGuild.removeMember(userId, function () {});
                        }
                    });
                }

                // --> async branch to update user's session
                redisSession.update(userId, {
                    guild: self._id
                }, function () {});

                // --> set the user's guild in mongo
                user.guild = self._id;
                user.save(function (err) {
                    if (err) {
                        return callback(err);
                    }

                    // add user to this guild's member list
                    self.addUserToList('members', userId, function (err) {
                        if (err) {
                            return callback(err);
                        }

                        return callback(null, this);
                    });
                });
            });
        };

        

        /**
         * Remove a member from this guild
         * @param {ObjectId} userId
         * @param {Function} callback
         */
        schema.methods.removeMember = function (userId, callback) {
            var self = this;

            // remove user from the member list
            self.removeUserFromList('members', userId, function (err) {
                if (err) {
                    return callback(err);
                }

                // load the user
                User.findExistingById(userId, 'guild', function (err, user) {
                    if (err) {
                        return callback(err);
                    }
                    if (user.guild !== self._id) {
                        return callback('User is not a member of this guild');
                    }

                    // --> async branch to unset user's guild in their session
                    redisSession.update(userId, {
                        guild: ''
                    }, function () {});

                    // unset the user's guild
                    user.guild = undefined;
                    user.save(function (err) {
                        if (err) {
                            return callback(err);
                        }

                        return callback(null, self);
                    });
                });
            });
        };

        

        /**
         * Add a user to an array
         * @param {string} list
         * @param {ObjectId} userId
         * @param {Function} callback
         */
        schema.methods.addUserToList = function (list, userId, callback) {
            var self = this;
            self[list] = _.filter(self[list], function (user) {
                return String(user._id) !== String(userId);
            });

            User.findExistingById(userId, '_id name site group', function (err, user) {
                if (err) {
                    return callback(err);
                }

                var nameDisplay = _.pick(user, '_id', 'name', 'site', 'group');
                self[list].push(nameDisplay);
                return self.save(callback);
            });
        };


        
        /**
         * Remove a member from an array and save
         * @param {string} list
         * @param {ObjectId} userId
         * @param {Function} callback
         */
        schema.methods.removeUserFromList = function (list, userId, callback) {
            var self = this;
            self[list] = _.filter(self[list], function (user) {
                return String(user._id) !== String(userId);
            });

            return self.save(callback);
        };



        /**
         * Remove user from applicants and add them to members
         * @param userId
         * @param callback
         */
        schema.methods.acceptApplication = function (userId, callback) {
            var self = this;
            self.addMember(userId, function (err) {
                if (err) {
                    return callback(err);
                }

                return self.removeUserFromList('applicants', userId, callback);
            });
        };


        
        /**
         * Remove user from invitations and add them to members
         * @param {ObjectId} userId
         * @param {Function} callback
         */
        schema.methods.acceptInvitation = function (userId, callback) {
            var self = this;
            self.addMember(userId, function (err) {
                if (err) {
                    return callback(err);
                }

                return self.removeInvitation(userId, callback);
            });
        };

        

        /**
         * Remove user id from guild.invitations
         * and remove guild id from user.guildInvitations
         * @param {ObjectId} userId
         * @param {Function} callback
         */
        schema.methods.removeInvitation = function (userId, callback) {
            var self = this;

            async.waterfall([
                function(cb) {
                    self.removeUserFromList('invitations', userId, cb);
                },
                function(guild, count, cb) {
                    User.findExistingById(userId, 'guildInvitations', cb);
                },
                function(user, cb) {
                    _.pull(user.guildInvitations, self._id);
                    user.save(cb);
                }
            ], callback);
        };
        
        
        
        /**
         * Add user id to guild.invitations
         * add guild id to user.guildInvitations
         * @param {ObjectId} userId
         * @param {Function} callback
         */
        schema.methods.addInvitation = function (userId, callback) {
            var self = this;
            
            async.waterfall([
                function(cb) {
                    self.addUserToList('invitations', userId, cb);
                },
                function(guild, count, cb) {
                    User.findExistingById(userId, 'guildInvitations', cb);
                },
                function(user, cb) {
                    user.guildInvitations.push(self._id);
                    user.guildInvitations = _.unique(user.guildInvitations);
                    user.save(cb);
                }
            ], callback);
        };

        
        
        /**
         * Increment gp counters by amount
         * @param {ObjectId} userId
         * @param {number} amount
         * @param {Function} callback
         */
        schema.methods.incGp = function (userId, amount, callback) {
            this.gp += amount;
            this.gpDay += amount;
            this.gpWeek += amount;
            this.gpLife += amount;

            var user = this.getMember(userId);
            if (user) {
                user.gpDay += amount;
                user.gpWeek += amount;
                user.gpLife += amount;
            }

            this.save(callback);
        };
    };
    
}());