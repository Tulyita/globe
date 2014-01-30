'use strict';

module.exports = function(globe) {

	require('./guildRoutes')(globe);

	var groups = require('./config/groups');

	// endpoints
	var avatars = require('./routes/avatars');
	var ban = require('./routes/ban');
	var bans = require('./routes/bans');
	var friend = require('./routes/friend');
	var friends = require('./routes/friends');
	var messages = require('./routes/messages');
	var reports = require('./routes/messages');
	var tests = require('./routes/tests');
	var tokens = require('./routes/tokens');
	var users = require('./routes/users');
	var moderator = require('./routes/moderator');
	var moderators = require('./routes/moderators');
	var apprentice = require('./routes/apprentice');
	var apprentices = require('./routes/apprentices');

	// middleware
	var checkAdmin = require('./middleware/checkAdmin');
	var checkMod = require('./middleware/checkMod');
	var checkLogin = require('./middleware/checkLogin');
	var rateLimit = require('./middleware/rateLimit');
	var continueSession = require('./middleware/continueSession');
	var loadUser = require('./middleware/loadUser');
	var loadMyself = require('./middleware/loadMyself');

	// routes
	globe.get('/avatars/:filename', avatars.get);

	globe.get('/bans', bans.get);
	globe.get('/bans/:userId', loadUser, ban.get);
	globe.post('/bans/:userId', continueSession, checkMod, rateLimit('post:bans'), loadUser, ban.post);

	globe.get('/friends', continueSession, loadMyself, friends.get);
	globe.get('/friends/:userId', continueSession, loadMyself, friend.get);
	globe.put('/friends/:userId', continueSession, loadMyself, loadUser, friend.put);
	globe.del('/friends/:userId', continueSession, loadMyself, friend.del);

	globe.get('/messages', continueSession, messages.get);
	globe.post('/messages', continueSession, rateLimit('post:messages'), messages.post);

	globe.get('/reports', continueSession, checkMod, reports.get);
	globe.post('/reports', continueSession, checkLogin, rateLimit('post:reports'), reports.post);

	globe.get('/tests', tests.get);

	globe.get('/tokens', rateLimit('get:tokens'), tokens.get);
	globe.del('/tokens', tokens.del);

	globe.get('/users', users.get);

	globe.get('/moderators', moderators.get);
	globe.get('/moderators/:userId', loadUser(groups.MOD), moderator.get);
	globe.put('/moderators/:userId', continueSession, checkAdmin, rateLimit('put:moderator'), loadUser(groups.APPRENTICE), moderator.put);
	globe.del('/moderators/:userId', continueSession, checkAdmin, loadUser(groups.MOD), moderator.del);

	globe.get('/apprentices', apprentices.get);
	globe.get('/apprentices/:userId', loadUser(groups.APPRENTICE), apprentice.get);
	globe.put('/apprentices/:userId', continueSession, checkMod, rateLimit('put:apprentice'), loadUser(groups.USER), apprentice.put);
	globe.del('/apprentices/:userId', continueSession, checkMod, loadUser(groups.APPRENTICE), apprentice.del);
};