'use strict';

var createHashId = require('./createHashId');
var Imager = require('imager'),
	imagerConfig = require('../config/bannerConfig.js'),
	imager = new Imager(imagerConfig, 'S3');


var saveBanner = function(guild, image, callback) {
	image.name = createHashId(guild._id) + '.jpg';
	image.type = 'image/jpg';
	imager.upload([image], function(err, endpoint, filenames) {
		if(err) {
			return callback(err);
		}
		var filename = filenames[0];

		guild.banner = {
			updated: new Date(),
			file: filename
		};

		guild.save(function(err) {
			if(err) {
				return callback(err);
			}
			return callback(null, filename);
		});
	}, 'guildBanner');
};

module.exports = saveBanner;