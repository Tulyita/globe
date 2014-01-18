'use strict';

var _ = require('lodash');
var Ban = require('../models/ban');

var bansPost  = function(req, res) {
	bansPost.populateMod(req.body, req.session);
	Ban.create(req.body, res.apiOut);
};

bansPost.populateMod = function(ban, session) {
	ban.mod = _.pick(session, '_id', 'name', 'site', 'group');
	return ban;
};

module.exports = bansPost;