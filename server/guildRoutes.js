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
	var checkGuildMod = require('./routes/guilds/middleware/checkGuildMod');
	var checkOwner = require('./routes/guilds/middleware/checkOwner');
	var checkOwnerOrSelf = require('./routes/guilds/middleware/checkOwnerOrSelf');
	var checkSelf = require('./routes/guilds/middleware/checkSelf');
	var invitationExists = require('./routes/guilds/middleware/invitationExists');
	var loadGuild = require('./routes/guilds/middleware/loadGuild');
	var modExists = require('./routes/guilds/middleware/modExists');

	// routes
	globe.get('/guilds', guilds.get);
	globe.put('/guilds/:guildId', checkUser, guild.put);
	globe.get('/guilds/:guildId', loadGuild, guild.get);
	globe.del('/guilds/:guildId', loadGuild, checkOwner, guild.del);

	globe.get('/guilds/:guildId/members', loadGuild, members.get);
	globe.get('/guilds/:guildId/members/:userId', loadGuild, member.get);

	globe.get('/guilds/:guildId/kicks', loadGuild, kicks.get);
	globe.get('/guilds/:guildId/kicks/:userId', loadGuild, kick.get);
	globe.put('/guilds/:guildId/kicks/:userId', loadGuild, checkGuildMod, kick.put);

	globe.get('/guilds/:guildId/applicants', loadGuild, applicants.get);
	globe.put('/guilds/:guildId/applicants/:userId', loadGuild, checkSelf, applicant.put);
	globe.post('/guilds/:guildId/applicants/:userId', loadGuild, checkOwner, applicantExists, applicant.post);
	globe.get('/guilds/:guildId/applicants/:userId', loadGuild, applicantExists, applicant.get);
	globe.del('/guilds/:guildId/applicants/:userId', loadGuild, checkOwnerOrSelf, applicantExists, applicant.del);

	globe.get('/guilds/:guildId/invitations', loadGuild, invitations.get);
	globe.put('/guilds/:guildId/invitations/:userId', loadGuild, checkOwner, invitation.put);
	globe.get('/guilds/:guildId/invitations/:userId', loadGuild, invitationExists, invitation.get);
	globe.post('/guilds/:guildId/invitations/:userId', loadGuild, checkSelf, invitationExists, invitation.post);
	globe.del('/guilds/:guildId/invitations/:userId', loadGuild, checkOwnerOrSelf, invitationExists, invitation.del);

	globe.get('/guilds/:guildId/settings', loadGuild, settings.get);
	globe.post('/guilds/:guildId/settings', loadGuild, checkOwner, settings.post);

	globe.get('/guilds/:guildId/mods', loadGuild, mods.get);
	globe.put('/guilds/:guildId/mods/:userId', loadGuild, checkOwner, mod.put);
	globe.get('/guilds/:guildId/mods/:userId', loadGuild, modExists, mod.get);
	globe.del('/guilds/:guildId/mods/:userId', loadGuild, checkOwner, modExists, mod.del);
};
