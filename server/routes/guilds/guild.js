'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Guild = require('../../models/guild');
var Groups = require('../../config/groups');

module.exports = {


	put: function(req, res) {
		var guild = {_id: req.params.guildId};
		guild.owners = [_.pick(req.session, '_id', 'name', 'site', 'group')];
		guild.members = [_.pick(req.session, '_id', 'name', 'site', 'group')];
		guild.members[0].mod = true;
		return Guild.create(guild, res.apiOut);
	},


	get: function(req, res) {
		return Guild.findById(req.body.guildId, {}, res.apiOut);
	},


	del: function(req, res) {
		return req.guild.removeAllMembers(function(err) {
			if(err) {
				return res.apiOut(err);
			}

			return req.guild.remove(res.apiOut);
		});
	}

};


var actions = {

	incGp: function(data, session, callback) {
		Guild.incGp(data.guildId, data.userId, callback);
	},
};

module.exports = fns;