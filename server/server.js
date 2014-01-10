(function() {
	'use strict';

	//--- initialize
	var express = require('express');
	var globe = express();


	//--- mongoose connect
	var mongoose = require('mongoose');
	mongoose.connect(process.env.MONGO_URI);


	//--- middleware
	globe.use(express.urlencoded());
	globe.use(express.json());
	//globe.use('/', handleErrors);
	globe.use(require('./middleware/output'));
	//globe.use('/', consolidateParams);
	//globe.use('/', continueSession);


	//--- load routes
	/*globe.post('/api/canonCards', checkMod, require('./routes/canonCardsPost'));
	globe.post('/mod/canonCards', checkMod, require('./routes/canonCardsPost'));
	globe.post('/admin/canonCards', checkMod, require('./routes/canonCardsPost'));
	globe.post('/server/canonCards', checkMod, require('./routes/canonCardsPost'));*/
	globe.get('/tests', require('./routes/testsGet'));


	//--- last ditch error handler
	process.on('uncaughtException', function (err) {
		console.log('unhandled error', err, err.stack);
	});


	//--- listen for requests
	globe.listen(process.env.PORT || 9001);


	//--- export globe for possible extending
	module.exports = globe;

}());
