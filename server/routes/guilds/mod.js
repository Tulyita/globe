'use strict';

module.exports = {


	put: function(req, res) {
		var member = req.guild.getMember(req.params.userId);
		if(!member) {
			return callback('Member "'+req.params.userId+'" not found.');
		}

		member.mod = true;

		return req.guild.save(res.apiOut);
	},


	get: function(req, res) {
		var mod = _.where(req.guild.members, {_id: req.params.userId, mod: true})[0];
		res.apiOut(null, mod);
	},


	del: function(req, res) {
		var member = req.guild.getMember(req.params.userId);
		if(!member) {
			return callback('Member "'+req.params.userId+'" not found.');
		}

		member.mod = false;

		return req.guild.save(res.apiOut);
	}
};