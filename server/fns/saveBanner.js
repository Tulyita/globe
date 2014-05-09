'use strict';

var createHashId = require('./createHashId');
var Imager = require('imager'),
	imagerConfig = require('../config/bannerConfig.js'),
	imager = new Imager(imagerConfig, 'S3');


var saveBanner = function(guild, image, callback) {
    
    var filename = createHashId(guild._id) + '.jpg';
    
	image.name = filename;
	image.type = 'image/jpg';
    
	imager.upload([image], function(err) {
		if(err) {
			return callback(err);
		}

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