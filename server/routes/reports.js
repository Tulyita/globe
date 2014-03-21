'use strict';

var _ = require('lodash');
var Report = require('../models/report');
var groups = require('../config/groups');


module.exports = {


	get: function(req, res) {

		// import data
		var page = req.body.page || 1;
		var count = req.body.count || 10;
		var find = req.body.find ? JSON.parse(req.body.find) : {seen: false};
		var sort = req.body.sort ? JSON.parse(req.body.sort) : {created: -1};

		// limit page range
		if(page < 1) {
			page = 1;
		}

		// limit possible count range
		if(count > 25) {
			count = 25;
		}

		// get paginated result
		Report.paginate(find, page, count, function(err, pageCount, results) {
			if (err) {
				return res.apiOut(err);
			}
			return res.apiOut(null, {pageCount: pageCount, results: results, page: page});
		}, {sortBy: sort});
	},


	post: function(req, res) {

		var reportData = _.pick(req.body.report, 'type', 'publicData', 'privateData', 'note', 'app');
		reportData.date = new Date();
		reportData.user = _.pick(req.user, '_id', 'name', 'group', 'site');

		if(reportData.type === 'message' && req.user.group === groups.GUEST) {
			return res.apiOut('Guests can not report messages');
		}
		else if([groups.APPRENTICE, groups.MOD, groups.ADMIN].indexOf(req.user.group) === -1) {
			return res.apiOut('Only admins, mods, and apprentices can post report type"'+reportData.type+'"');
		}

		Report.create(reportData, function(err, report) {
			return res.apiOut(err, report);
		});
	}
};