'use strict';

var _ = require('lodash');
var Guild = require('../../models/guild');
var saveBanner = require('../../fns/saveBanner');


module.exports = {


	put: function(req, res) {
		var guildData = {_id: req.params.guildId};
		guildData.owners = [_.pick(req.session, '_id', 'name', 'site', 'group')];
		guildData.members = [_.pick(req.session, '_id', 'name', 'site', 'group')];
		guildData.members[0].mod = true;
		guildData.banner = {};

		Guild.create(guildData, function(err, guild) {
			if(err) {
				return res.apiOut(err);
			}
			if(!req.files || !req.files.bannerImg) {
				return res.apiOut(null, guild);
			}

			saveBanner(guild, req.files.bannerImg, function(err) {
				if(err) {
					return res.apiOut(err);
				}
				return res.apiOut(null, guild);
			});
		});
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