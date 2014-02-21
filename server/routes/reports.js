'use strict';

var _ = require('lodash');
var Report = require('../models/report');
var groups = require('../config/groups');


module.exports = {


	get: function(req, res) {
		Report.find({seen: false}, {}, {sort: {created: -1}}, res.apiOut);
	},


	post: function(req, res) {

		var reportData = _.pick(req.body.report, 'type', 'publicData', 'privateData', 'note', 'app');
		reportData.date = new Date();
		reportData.user = _.pick(req.user, '_id', 'name', 'group', 'site');

		console.log('1', reportData);

		if(reportData.type === 'message' && req.user.group === groups.GUEST) {
			return res.apiOut('Guests can not report messages');
		}
		else if([groups.APPRENTICE, groups.MOD, groups.ADMIN].indexOf(req.user.group) === -1) {
			return res.apiOut('Only admins, mods, and apprentices can post report type"'+reportData.type+'"');
		}
		console.log('2', reportData);
		Report.create(reportData, function(err, report) {
			console.log('3', err, report);
			return res.apiOut(err, report);
		});
	}
};