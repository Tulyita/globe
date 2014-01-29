module.exports = function(globe) {


	// endpoints
	var applicant = require('./routes/guilds/applicant');
	var applicants = require('./routes/guilds/applicants');
	var guild = require('./routes/guilds/guild');
	var guildGp = require('./routes/guilds/guildGp');
	var guilds = require('./routes/guilds/guilds');
	var invitation = require('./routes/guilds/invitation');
	var invitations = require('./routes/guilds/invitations');
	var kick = require('./routes/guilds/kick');
	var kicks = require('./routes/guilds/kicks');
	var member = require('./routes/guilds/member');
	var members = require('./routes/guilds/members');
	var mod = require('./routes/guilds/mod');
	var mods = require('./routes/guilds/mods');
	var settings = require('./routes/guilds/settings');
	var userGp = require('./routes/guilds/userGp');


	// middleware
	var checkUser = require('./middleware/checkUser');
	var checkServer = require('./middleware/checkServer');

	var applicantExists = require('./routes/guilds/middleware/applicantExists');
	var guildModExists = require('./routes/guilds/middleware/guildModExists');
	var invitationExists = require('./routes/guilds/middleware/invitationExists');
	var memberExists = require('./routes/guilds/middleware/memberExists');
	var isGuildMod = require('./routes/guilds/middleware/isGuildMod');
	var isOwner = require('./routes/guilds/middleware/isOwner');
	var isOwnerOrSelf = require('./routes/guilds/middleware/isOwnerOrSelf');
	var isSelf = require('./routes/guilds/middleware/isSelf');
	var loadGuild = require('./routes/guilds/middleware/loadGuild');


	// routes
	globe.get('/guilds', guilds.get);
	globe.put('/guilds/:guildId', checkUser, guild.put);
	globe.get('/guilds/:guildId', loadGuild, guild.get);
	globe.del('/guilds/:guildId', loadGuild, isOwner, guild.del);
	globe.post('/guilds/:guildId/gp', loadGuild, checkServer, guildGp.post);
	globe.get('/guilds/:guildId/gp', loadGuild, guildGp.get);

	globe.get('/guilds/:guildId/members', loadGuild, memberExists, members.get);
	globe.get('/guilds/:guildId/members/:userId', loadGuild, memberExists, member.get);
	globe.post('/guilds/:guildId/members/:userId/gp', loadGuild, memberExists, checkServer, userGp.post);
	globe.get('/guilds/:guildId/members/:userId/gp', loadGuild, memberExists, userGp.get);

	globe.get('/guilds/:guildId/kicks', loadGuild, kicks.get);
	globe.get('/guilds/:guildId/kicks/:userId', loadGuild, kick.get);
	globe.put('/guilds/:guildId/kicks/:userId', loadGuild, isGuildMod, kick.put);

	globe.get('/guilds/:guildId/applicants', loadGuild, applicants.get);
	globe.put('/guilds/:guildId/applicants/:userId', loadGuild, isSelf, applicant.put);
	globe.post('/guilds/:guildId/applicants/:userId', loadGuild, isOwner, applicantExists, applicant.post);
	globe.get('/guilds/:guildId/applicants/:userId', loadGuild, applicantExists, applicant.get);
	globe.del('/guilds/:guildId/applicants/:userId', loadGuild, isOwnerOrSelf, applicantExists, applicant.del);

	globe.get('/guilds/:guildId/invitations', loadGuild, invitations.get);
	globe.put('/guilds/:guildId/invitations/:userId', loadGuild, isOwner, invitation.put);
	globe.get('/guilds/:guildId/invitations/:userId', loadGuild, invitationExists, invitation.get);
	globe.post('/guilds/:guildId/invitations/:userId', loadGuild, isSelf, invitationExists, invitation.post);
	globe.del('/guilds/:guildId/invitations/:userId', loadGuild, isOwnerOrSelf, invitationExists, invitation.del);

	globe.get('/guilds/:guildId/settings', loadGuild, settings.get);
	globe.post('/guilds/:guildId/settings', loadGuild, isOwner, settings.post);

	globe.get('/guilds/:guildId/mods', loadGuild, mods.get);
	globe.put('/guilds/:guildId/mods/:userId', loadGuild, isOwner, mod.put);
	globe.get('/guilds/:guildId/mods/:userId', loadGuild, guildModExists, mod.get);
	globe.del('/guilds/:guildId/mods/:userId', loadGuild, isOwner, guildModExists, mod.del);

};
