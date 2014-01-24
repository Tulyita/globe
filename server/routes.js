'use strict';

module.exports = function(globe) {
	globe.get('/tests', require('./routes/testsGet'));
	globe.get('/tokens', require('./routes/tokens'));
	globe.get('/users', require('./routes/usersGet'));
	globe.get('/avatars/:filename', require('./routes/avatarsGet'));
};