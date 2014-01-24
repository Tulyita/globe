'use strict';

module.exports = function(globe) {
	globe.get('/tests', require('./routes/tests'));
	globe.get('/tokens', require('./routes/tokens'));
	globe.get('/users', require('./routes/users'));
	globe.get('/avatars/:filename', require('./routes/avatars'));
};