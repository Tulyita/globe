'use strict';

var _ = require('lodash');
var Report = require('../models/report');
var groups = require('../config/groups');


module.exports = {


	get: function(req, res) {
		Report.find({seen: false}, {}, {sort: {created: -1}}, res.apiOut);
	},


	post: function(req, res) {

		var reportData = _.pick(req.body.report, 'type', 'publicData', 'privateData');
		reportData.date = new Date();
		reportData.user = _.pick(req.user, '_id', 'name', 'group', 'site');

		if(reportData.type === 'message' && req.user.group === groups.GUEST) {
			return res.apiOut('Guests can not report messages');
		}
		else if([groups.APPRENTICE, groups.MOD, groups.ADMIN].indexOf(req.user.group) === -1) {
			return res.apiOut('Only admins, mods, and apprentices can post report type"'+type+'"');
		}

		Report.create(reportData, function(err, report) {
			if(err) {
				return res.apiOut(err);
			}
			return res.apiOut(null, report);
		});
	}
};