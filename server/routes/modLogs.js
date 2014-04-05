'use strict';

var ModLog = require('../models/modLog');
var paginate = require('../fns/paginate');


module.exports = {

	getList: function(req, res) {
		var options = {
			page: req.body.page,
			count: req.body.count,
			find: req.body.find,
			sort: req.body.sort,
			allowFindBy: ['mod._id'],
			allowSortBy: ['_id'],
			model: ModLog
		};
		return paginate(options, res.apiOut);
	},


	get: function(req, res) {
		ModLog.findById(req.params.modLogId, res.apiOut);
	}
};