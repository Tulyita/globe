'use strict';

module.exports = function(globe) {

	require('./guildRoutes')(globe);

	var groups = require('./config/groups');

	// endpoints
	var apprentice = require('./routes/apprentice');
	var apprentices = require('./routes/apprentices');
	var avatars = require('./routes/avatars');
	var ban = require('./routes/ban');
	var bans = require('./routes/bans');
	var conversation = require('./routes/conversation');
	var conversations = require('./routes/conversations');
	var friend = require('./routes/friend');
	var friends = require('./routes/friends');
	var messages = require('./routes/messages');
	var moderator = require('./routes/moderator');
	var moderators = require('./routes/moderators');
	var modLogs = require('./routes/modLogs');
	var report = require('./routes/report');
	var reports = require('./routes/reports');
	var sessions = require('./routes/sessions');
	var tests = require('./routes/tests');

	// middleware
	var checkAdmin = require('./middleware/checkAdmin');
	var checkMod = require('./middleware/checkMod');
	var checkServer = require('./middleware/checkServer');
	var rateLimit = require('./middleware/rateLimit');
	var continueSession = require('./middleware/continueSession');
	var loadUser = require('./middleware/loadUser');
	var loadMyself = require('./middleware/loadMyself');
    

	// routes
    require('./routes/users').init(globe);
    
	globe.get('/avatars/:filename', avatars.get);

	globe.get('/bans', bans.get);
	globe.get('/bans/:userId', loadUser(), ban.get);
	globe.post('/bans/:userId', continueSession, checkMod, rateLimit('post:bans'), loadUser(), ban.post);
	globe.del('/bans/:userId/:banId', continueSession, checkMod, rateLimit('delete:bans'), loadUser(), ban.del);

	globe.get('/friends', continueSession, loadMyself, friends.get);
	globe.get('/friends/:userId', continueSession, loadMyself, friend.get);
	globe.put('/friends/:userId', continueSession, loadMyself, loadUser(), friend.put);
	globe.del('/friends/:userId', continueSession, loadMyself, friend.del);

	globe.get('/messages/unread/count', continueSession, loadMyself, messages.getUnreadCount);
	globe.get('/messages', continueSession, loadMyself, messages.get);
	globe.post('/messages', continueSession, rateLimit('post:messages'), loadMyself, loadUser(null, '_id name group site messages'), messages.post);

	globe.get('/conversations', continueSession, loadMyself, conversations.get);
	globe.get('/conversations/:userId', continueSession, loadMyself, conversation.get);
	globe.post('/conversations/:userId', continueSession, loadMyself, conversation.post);

	globe.get('/reports/:reportId', continueSession, checkMod, report.get);
	globe.post('/reports/:reportId', continueSession, checkMod, report.post);
	globe.get('/reports', continueSession, checkMod, reports.get);
	globe.post('/reports', continueSession, checkServer, loadUser(), rateLimit('post:reports'), reports.post);

	globe.get('/tests', tests.get);

	globe.post('/sessions', sessions.post);
	globe.del('/sessions/:token', continueSession, sessions.del);
	globe.get('/sessions', sessions.get);

	globe.get('/moderators', moderators.get);
	globe.get('/moderators/:userId', loadUser(groups.MOD), moderator.get);
	globe.put('/moderators/:userId', continueSession, checkAdmin, rateLimit('put:moderator'), loadUser(groups.APPRENTICE), moderator.put);
	globe.del('/moderators/:userId', continueSession, checkAdmin, loadUser(groups.MOD), moderator.del);

	globe.get('/mod-logs', modLogs.getList);
	globe.get('/mod-logs/:modLogId', modLogs.get);

	globe.get('/apprentices', apprentices.get);
	globe.get('/apprentices/:userId', loadUser(groups.APPRENTICE), apprentice.get);
	globe.put('/apprentices/:userId', continueSession, checkMod, rateLimit('put:apprentice'), loadUser(groups.USER), apprentice.put);
	globe.del('/apprentices/:userId', continueSession, checkMod, loadUser(groups.APPRENTICE), apprentice.del);
};