'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Guild = require('../../models/guild');

module.exports = {


	put: function(req, res) {
		var guild = {_id: req.params.guildId};
		guild.owners = [_.pick(req.session, '_id', 'name', 'site', 'group')];
		guild.members = [_.pick(req.session, '_id', 'name', 'site', 'group')];
		guild.members[0].mod = true;
		return Guild.create(guild, res.apiOut);
	},


	get: function(req, res) {
		res.apiOut(null, req.guild);
	},


	del: function(req, res) {
		req.guild.removeAllMembers(function(err) {
			if(err) {
				return res.apiOut(err);
			}

			return req.guild.remove(function(err) {
				if(err) {
					res.apiOut(err);
				}

				return res.status(204).send();
			});
		});
	}

};