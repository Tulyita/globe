'use strict';

var permissions = require('../fns/permissions');


module.exports = {

	get: function(req, res) {

		console.log('session', req.session);
		var user = req.user;
		var obj = user.publicData();
		obj.actions = {
			message: permissions.iCanMessage(req.session, user),
			apprentice: permissions.iCanApprentice(req.session, user),
			deApprentice: permissions.iCanDeApprentice(req.session, user),
			mod: permissions.iCanMod(req.session, user),
			deMod: permissions.iCanDeMod(req.session, user),
			ban: permissions.iCanBan(req.session, user),
			deBan: permissions.iCanDeBan(req.session, user),
			report: permissions.iCanReport(req.session, user)
		};

		res.apiOut(null, obj);
	}
};