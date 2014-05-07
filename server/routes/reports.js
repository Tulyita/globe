(function() {

    'use strict';

    var _ = require('lodash');
    var Report = require('../models/report');
    var groups = require('../config/groups');
    var paginate = require('../fns/paginate');
    
	var checkMod = require('../middleware/checkMod');
	var checkServer = require('../middleware/checkServer');
	var rateLimit = require('../middleware/rateLimit');
	var continueSession = require('../middleware/continueSession');
	var loadUser = require('../middleware/loadUser');


    var self = {


        init: function (app) {
            app.get('/reports', continueSession, checkMod, self.getList);
            app.post('/reports', continueSession, checkServer, loadUser(), rateLimit('post:reports'), self.post);
            app.get('/reports/:reportId', continueSession, checkMod, self.get);
            app.post('/reports/:reportId', continueSession, checkMod, self.edit);
        },


        getList: function (req, res) {
            var data = {
                model: Report,
                page: req.body.page,
                count: req.body.count,
                find: req.body.find || {seen: false},
                sort: req.body.sort || {created: -1},
                allowFindBy: ['seen'],
                allowSortBy: ['created']
            };
            paginate(data, res.apiOut);
        },


        post: function (req, res) {

            var reportData = _.pick(req.body.report, 'type', 'publicData', 'privateData', 'note', 'app');
            reportData.date = new Date();
            reportData.user = _.pick(req.user, '_id', 'name', 'group', 'site');

            if (reportData.type === 'message' && req.user.group === groups.GUEST) {
                return res.apiOut('Guests can not report messages');
            } else if ([groups.APPRENTICE, groups.MOD, groups.ADMIN].indexOf(req.user.group) === -1) {
                return res.apiOut('Only admins, mods, and apprentices can post report type"' + reportData.type + '"');
            }

            Report.create(reportData, function (err, report) {
                return res.apiOut(err, report);
            });
        },


        get: function (req, res) {
            Report.findById(req.params.reportId, res.apiOut);
        },


        edit: function (req, res) {
            var seen = req.param('seen');

            Report.findById(req.params.reportId, function (err, report) {
                if (err) {
                    return res.apiOut(err);
                }

                report.seen = seen;
                report.save(function (err) {
                    res.apiOut(err, report);
                });
            });
        }
    };
    
    module.exports = self;

}());