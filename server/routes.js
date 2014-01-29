'use strict';

module.exports = function(globe) {

	require('./guildRoutes')(globe);

	var avatars = require('./routes/avatars');
	var bans = require('./routes/bans');
	var friends = require('./routes/friends');
	var messages = require('./routes/messages');
	var reports = require('./routes/messages');
	var tests = require('./routes/tests');
	var tokens = require('./routes/tokens');
	var users = require('./routes/users');

	globe.get('/avatars/:filename', avatars.get);
	globe.get('/bans', bans.get);
	globe.post('/bans', bans.post);
	globe.get('/friends', friends.get);
	globe.post('/friends', friends.post);
	globe.get('/messages', messages.get);
	globe.post('/messages', messages.post);
	globe.get('/reports', reports.get);
	globe.post('/reports', reports.post);
	globe.get('/tests', tests.get);
	globe.get('/tokens', tokens.get);
	globe.del('/tokens', tokens.del);
	globe.get('/users', users.get);
};