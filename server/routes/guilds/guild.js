'use strict';

var _ = require('lodash');
var Guild = require('../../models/guild');
var saveBanner = require('../../fns/saveBanner');


module.exports = {


	put: function(req, res) {
		if(req.myself.guild) {
			return(res.apiOut('You are already a member of guild "'+req.myself.guild+'"'));
		}

		var guildData = {_id: req.params.guildId, desc: req.body.desc};
		guildData.owners = [_.pick(req.session, '_id', 'name', 'site', 'group')];
		guildData.members = [_.pick(req.session, '_id', 'name', 'site', 'group')];
		guildData.members[0].mod = true;
		guildData.banner = {};

		// create the guild
		Guild.create(guildData, function(err, guild) {
			if(err) {
				return res.apiOut(err);
			}
			if(!req.files || !req.files.bannerImg) {
				return res.apiOut(null, guild);
			}

			// set myself as a member of this guild
			req.myself.guild = guild._id;
			req.myself.save(function(err) {
				if(err) {
					return res.apiOut(err);
				}

				//save the banner
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