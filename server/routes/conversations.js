(function () {

    'use strict';

    var _ = require('lodash');
    var convoFns = require('../fns/convoFns');
    var Report = require('../models/report');
    var continueSession = require('../middleware/continueSession');
    var loadMyself = require('../middleware/loadMyself');


    var self = {


        init: function (app) {
            app.get('/conversations', continueSession, loadMyself, self.getList);
            app.get('/conversations/:userId', continueSession, loadMyself, self.get);
            app.post('/conversations/:userId', continueSession, loadMyself, self.post);
            app.del('/conversations/:userId', continueSession, loadMyself, self.del);
        },


        getList: function (req, res) {
            var page = req.body.page || 1;
            var count = req.body.count || 10;
            var convos = convoFns.formConvos(req.myself._id, req.myself.messages);

            // create an array of only the most recent message in each conversation
            var arr = _.map(convos, function (convo) {
                var mostRecentMessage = convo.slice(convo.length - 1, convo.length);
                return convoFns.copyPublicData(mostRecentMessage)[0];
            });

            // sort by recentness
            arr = _.sortBy(arr, 'date').reverse();

            //paginate
            var pageCount = Math.ceil(arr.length / count);
            var results = arr.splice((page - 1) * count, count);

            // output
            res.apiOut(null, {page: page, pageCount: pageCount, results: results});
        },


        get: function (req, res) {
            var convo = convoFns.formConvo(req.session._id, req.params.userId, req.myself.messages);

            if (!convo) {
                return res.apiOut({
                    code: 404,
                    message: 'Conversation not found'
                });
            }

            var publicConvo = convoFns.copyPublicData(convo);

            convoFns.markConvoRead(convo);
            req.myself.save();

            return res.apiOut(null, publicConvo);
        },


        post: function (req, res) {
            var action = req.param('action');

            if (action === 'report') {

                var convo = convoFns.formConvo(req.session._id, req.params.userId, req.myself.messages);
                if (!convo) {
                    return res.apiOut({
                        code: 404,
                        message: 'Conversation not found'
                    });
                }
                var publicConvo = convoFns.copyPublicData(convo);

                var reportData = {
                    type: 'convo',
                    privateData: publicConvo,
                    user: _.pick(req.myself, '_id', 'name', 'group', 'site')
                };

                return Report.create(reportData, function (err) {
                    return res.apiOut(err, publicConvo);
                });
            }

            return res.apiOut('action "' + action + '" not found');
        },
        
        
        del: function(req, res) {
            var targetUserId = req.params.userId;
            var messages = req.myself.messages.toObject();
            
            // remove all messages to or from targetUserId
            req.myself.messages = _.filter(messages, function(message) {
                return String(message.fromUser._id) !== targetUserId && String(message.toUser._id) !== targetUserId;
            });
            
            // save
            req.myself.save(function(err) {
                if(err) {
                    return res.apiOut(err);
                }
                
                // respond with deleted
                return res.send(204, null);
            });
        }
    };

    module.exports = self;

}());