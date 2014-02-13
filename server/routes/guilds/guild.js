'use strict';

var _ = require('lodash');
var Guild = require('../../models/guild');
var saveBanner = require('../../fns/saveBanner');


module.exports = {


	put: function(req, res) {
		var guildData = {_id: req.params.guildId, desc: req.body.desc, join: req.body.join};
		guildData.owners = [_.pick(req.session, '_id', 'name', 'site', 'group')];
		guildData.banner = {};

		// create the guild
		Guild.create(guildData, function(err, guild) {
			if(err) {
				return res.apiOut(err);
			}

			// set myself as a member of this guild
			guild.addMember(req.myself._id, function(err) {
				if(err) {
					return res.apiOut(err);
				}

				// --> don't save a banner
				if(!req.files || !req.files.bannerImg) {
					return res.apiOut(null, guild);
				}

				// --> save a banner
				saveBanner(guild, req.files.bannerImg, function(err) {
					if(err) {
						return res.apiOut(err);
					}
					return res.apiOut(null, guild);
				});
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