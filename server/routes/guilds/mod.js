'use strict';

var _ = require('lodash');


module.exports = {


	put: function(req, res) {
		var member = req.guild.getMember(req.params.userId);
		member.mod = true;
		req.guild.save(function(err) {
			return res.apiOut(err, member);
		});
	},


	get: function(req, res) {
		var mod = _.where(req.guild.members, {_id: req.params.userId, mod: true})[0];
		res.apiOut(null, mod);
	},


	del: function(req, res) {
		var member = req.guild.getMember(req.params.userId);
		member.mod = false;
		return req.guild.save(function(err) {
			if(err) {
				return res.apiOut(err);
			}
			return res.status(204).send();
		});
	}
};