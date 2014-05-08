(function() {
    'use strict';
    
    var _ = require('lodash');
    var continueSession = require('../middleware/continueSession');
    var loadMyself = require('../middleware/loadMyself');
    var Guild = require('../models/guild');
    
    
    var getUnreadCount = function(user) {
        var unreadMessages = _.filter(user.messages, {read: false});
        return unreadMessages.length;
    };
    
    
    var getApplicantCount = function(user, callback) {
        if(!user.guild) {
            return callback(null, 0);
        }
        
        Guild.findExistingById(user.guild, 'owners applicants', function(err, guild) {
            if(err) {
                return callback(err);
            }
            if(!guild.getOwner(user._id)) {
                return callback(null, 0);
            }
            return callback(null, guild.applicants.length);
        });
    };
    
    
    var self = {
        
        
        init: function(app) {
            app.get('/notifications', continueSession, loadMyself, self.get);
        },
        
        
        get: function(req, res) {
            
            getApplicantCount(req.myself, function(err, applicantCount) {
                if(err) {
                    return res.apiOut(err);
                }
                
                var notifications = {
                    unreadMessageCount: getUnreadCount(req.myself),
                    invitationCount: req.myself.guildInvites.length,
                    applicantCount: applicantCount
                };
                res.apiOut(null, notifications);
            });
            
        }
    };
    
    module.exports = self;
    
}());