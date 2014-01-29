module.exports = function(globe) {

	// endpoints
	var applicant = require('./routes/guilds/applicant');
	var applicants = require('./routes/guilds/applicants');
	var guild = require('./routes/guilds/guild');
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

	// middleware
	var applicantExists = require('middleware/applicantExists');
	var checkUser = require('middleware/checkUser');
	var checkGuildMod = require('./routes/guilds/middleware/isGuildMod');
	var checkOwner = require('./routes/guilds/middleware/isOwner');
	var checkOwnerOrSelf = require('./routes/guilds/middleware/isOwnerOrSelf');
	var checkSelf = require('./routes/guilds/middleware/isSelf');
	var invitationExists = require('./routes/guilds/middleware/invitationExists');
	var loadGuild = require('./routes/guilds/middleware/loadGuild');
	var modExists = require('./routes/guilds/middleware/guildModExists');

	// routes
	globe.get('/guilds', guilds.get);
	globe.put('/guilds/:guildId', checkUser, guild.put);
	globe.get('/guilds/:guildId', loadGuild, guild.get);
	globe.del('/guilds/:guildId', loadGuild, isOwner, guild.del);

	globe.get('/guilds/:guildId/members', loadGuild, members.get);
	globe.get('/guilds/:guildId/members/:userId', loadGuild, member.get);

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
