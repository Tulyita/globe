'use strict';

var _ = require('lodash');
var Guild = require('../../models/guild');
var Imager = require('imager'),
	imagerConfig = require('../../config/bannerConfig.js'),
	imager = new Imager(imagerConfig, 'S3');


module.exports = {


	put: function(req, res) {
		if(!req.files || !req.files.image) {
			return res.apiOut('no image found');
		}

		var guildId = req.params.guildId;
		var image = req.files.image;

		image.name = guildId + '.jpg';
		image.type = 'image/jpg';
		imager.upload([image], callback, 'guildBanner');

		res.apiOut(null, req.guild.banner);
	},


	get: function(req, res) {
		res.apiOut(null, req.guild.banner);
	}

};