module.exports = function(globe) {

	// endpoints
	var applicant = require('./guilds/applicant');
	var applicants = require('./guilds/applicants');
	var guild = require('./guilds/guild');
	var guilds = require('./guilds/guilds');
	var invitation = require('./guilds/invitation');
	var invitations = require('./guilds/invitations');
	var kick = require('./guilds/kick');
	var kicks = require('./guilds/kicks');
	var member = require('./guilds/member');
	var members = require('./guilds/members');
	var mod = require('./guilds/mod');
	var mods = require('./guilds/mods');
	var settings = require('./guilds/settings');

	// middleware
	var checkUser = require('../middleware/checkUser');
	var checkGuildMod = require('./guilds/middleware/checkGuildMod');
	var checkOwner = require('./guilds/middleware/checkOwner');
	var checkOwnerOrSelf = require('./guilds/middleware/checkOwnerOrSelf');
	var checkSelf = require('./guilds/middleware/checkSelf');
	var loadGuild = require('./guilds/middleware/loadGuild');

	// routes
	globe.get('/guilds', guilds.get);
	globe.put('/guilds/:guildId', checkUser, guild.put);
	globe.get('/guilds/:guildId', loadGuild, guild.get);
	globe.del('/guilds/:guildId', loadGuild, checkOwner, guild.del);

	globe.get('/guilds/:guildId/members', loadGuild, members.get);
	globe.get('/guilds/:guildId/members/:userId', loadGuild, member.get);

	globe.get('/guilds/:guildId/kicks', loadGuild, kicks.get);
	globe.get('/guilds/:guildId/kicks/:userId', loadGuild, kick.get);
	globe.post('/guilds/:guildId/kicks/:userId', loadGuild, checkGuildMod, kick.post);

	globe.get('/guilds/:guildId/applicants', loadGuild, applicants.get);
	globe.put('/guilds/:guildId/applicants/:userId', loadGuild, checkSelf, applicant.put);
	globe.post('/guilds/:guildId/applicants/:userId', loadGuild, checkOwner, applicant.post);
	globe.get('/guilds/:guildId/applicants/:userId', loadGuild, applicant.get);
	globe.del('/guilds/:guildId/applicants/:userId', loadGuild, checkOwnerOrSelf, applicant.del);

	globe.get('/guilds/:guildId/invitations', loadGuild, invitations.get);
	globe.put('/guilds/:guildId/invitations/:userId', loadGuild, checkOwner, invitation.put);
	globe.get('/guilds/:guildId/invitations/:userId', loadGuild, invitation.get);
	globe.post('/guilds/:guildId/invitations/:userId', loadGuild, checkSelf, invitation.post);
	globe.del('/guilds/:guildId/invitations/:userId', loadGuild, checkOwnerOrSelf, invitation.del);

	globe.get('/guilds/:guildId/settings', loadGuild, settings.get);
	globe.post('/guilds/:guildId/settings', loadGuild, checkOwner, settings.post);

	globe.get('/guilds/:guildId/mods', loadGuild, mods.get);
	globe.put('/guilds/:guildId/mods/:userId', loadGuild, checkOwner, mod.put);
	globe.get('/guilds/:guildId/mods/:userId', loadGuild, mod.get);
	globe.del('/guilds/:guildId/mods/:userId', loadGuild, checkOwner, mod.del);
};
