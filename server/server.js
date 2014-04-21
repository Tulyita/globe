'use strict';

// initialize
var express = require('express');
var globe = express();


// settings
globe.set('trust proxy', true);


// mongoose connect
var mongoose = require('mongoose');
require('./fns/mongoose/findByIdAndSave').attach(mongoose);
require('./fns/mongoose/findOneAndSave').attach(mongoose);
require('./fns/mongoose/validatedUpdate').attach(mongoose);
mongoose.connect(process.env.MONGO_URI);


// redis connect
var redis = require('./fns/redisSession');
redis.connect(process.env.REDIS_URI);


// middleware
require('./middleware')(globe);


// routes
require('./routes')(globe);


// last ditch error handler
process.on('uncaughtException', function (err) {
	console.log('unhandled error', err, err.stack);
});


// listen for requests
globe.listen(process.env.PORT || 9002);


// export globe for possible extending
module.exports = globe;
