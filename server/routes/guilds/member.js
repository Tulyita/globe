'use strict';

var Guild = require('../../models/guild');

module.exports = {


	get: function(req, res) {
		var member = req.guild.getMember(req.params.userId);
		if(!member) {
			return res.status(404).send('Member not found');
		}

		return res.apiOut(null, member);
	}

};