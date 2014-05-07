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
        }
    };

    module.exports = self;

}());