'use strict';

var Report = require('../models/report');
var groups = require('../config/groups');


module.exports = {


	get: function(req, res) {
		Report.find({seen: false}, {}, {sort: {created: -1}}, res.apiOut);
	},


	post: function(req, res) {
		var type = req.body.type;
		if(type === 'message' && req.session.group === groups.GUEST) {
			return res.apiOut('Guests can not report messages');
		}
		else if([groups.APPRENTICE, groups.MOD, groups.ADMIN].indexOf(req.session.group) === -1) {
			return res.apiOut('Members can not report "'+type+'"');
		}
		Report.create(req.body, res.apiOut);
	}
};