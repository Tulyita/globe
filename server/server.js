(function() {
	'use strict';

	//--- initialize
	/*var checkAuth = require('./middleware/checkAuth');
	var checkMod = require('./middleware/checkMod');*/
	var express = require('express');
	var globe = express();


	//--- mongoose connect
	var mongoose = require('mongoose');
	require('./fns/mongoose/findByIdAndSave').attach(mongoose);
	require('./fns/mongoose/findOneAndSave').attach(mongoose);
	require('./fns/mongoose/validatedUpdate').attach(mongoose);
	require('./fns/mongoose/vValidate').attach(mongoose);
	mongoose.connect(process.env.MONGO_URI);


	//--- redis connect
	var redis = require('./fns/redisSession');
	redis.connect(process.env.REDIS_URI);


	//--- middleware
	globe.use(express.urlencoded());
	globe.use(express.json());
	globe.use(require('./middleware/handleErrors'));
	globe.use(require('./middleware/output'));
	globe.use(require('./middleware/consolidateParams'));
	globe.use(require('./middleware/continueSession'));


	//--- load routes
	globe.get('/tests', require('./routes/testsGet'));
	globe.get('/tokens', require('./routes/tokensGet'));
	globe.delete('/tokens', require('./routes/tokensDelete'));
	globe.get('/users', require('./routes/usersGet'));
	globe.get('/avatars/:filename', require('./routes/avatarsGet'));


	//--- last ditch error handler
	process.on('uncaughtException', function (err) {
		console.log('unhandled error', err, err.stack);
	});


	//--- listen for requests
	globe.listen(process.env.PORT || 9001);


	//--- export globe for possible extending
	module.exports = globe;

}());
