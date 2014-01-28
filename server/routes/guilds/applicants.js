'use strict';

module.exports = {

	get: function(req, res) {
		res.apiOut(req.guild.applicants);
	}
};