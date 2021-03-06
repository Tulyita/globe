'use strict';

module.exports = function (globe) {


    // endpoints
    var banner = require('./routes/guilds/banner');
    var kick = require('./routes/guilds/kick');
    var kicks = require('./routes/guilds/kicks');
    var member = require('./routes/guilds/member');
    var members = require('./routes/guilds/members');
    var mod = require('./routes/guilds/mod');
    var mods = require('./routes/guilds/mods');
    var settings = require('./routes/guilds/settings');


    // middleware
    var checkUser = require('./middleware/checkUser');
    var continueSession = require('./middleware/continueSession');
    var loadMyself = require('./middleware/loadMyself');
    var loadUser = require('./middleware/loadUser');

    var guildModExists = require('./routes/guilds/middleware/guildModExists');
    var memberExists = require('./routes/guilds/middleware/memberExists');
    var isGuildMod = require('./routes/guilds/middleware/isGuildMod');
    var isOwner = require('./routes/guilds/middleware/isOwner');
    var isSelf = require('./routes/guilds/middleware/isSelf');
    var loadGuild = require('./routes/guilds/middleware/loadGuild');


    // routes
    require('./routes/guilds/invites').init(globe);
    require('./routes/guilds/guilds').init(globe);
    require('./routes/guilds/guildGp').init(globe);
    require('./routes/guilds/applicants').init(globe);

    globe.get('/guilds/:guildId/members', loadGuild, members.get);
    globe.get('/guilds/:guildId/members/:userId', loadGuild, memberExists, member.get);
    globe.put('/guilds/:guildId/members/:userId', loadGuild, continueSession, isSelf, checkUser, member.put);
    globe.del('/guilds/:guildId/members/:userId', loadGuild, continueSession, isSelf, checkUser, member.del);

    globe.get('/guilds/:guildId/kicks', loadGuild, kicks.get);
    globe.get('/guilds/:guildId/kicks/:userId', loadGuild, kick.get);
    globe.put('/guilds/:guildId/kicks/:userId', continueSession, loadGuild, loadUser(), loadMyself, isGuildMod, kick.put);
    globe.del('/guilds/:guildId/kicks/:userId', continueSession, loadGuild, loadUser(), loadMyself, isGuildMod, kick.del);

    globe.get('/guilds/:guildId/settings', loadGuild, settings.get);
    globe.post('/guilds/:guildId/settings', loadGuild, continueSession, isOwner, settings.post);

    globe.get('/guilds/:guildId/banner', loadGuild, settings.get);
    globe.put('/guilds/:guildId/banner', loadGuild, continueSession, isOwner, banner.put);

    globe.get('/guilds/:guildId/mods', loadGuild, mods.get);
    globe.put('/guilds/:guildId/mods/:userId', loadGuild, continueSession, loadUser(), loadMyself, isOwner, mod.put);
    globe.get('/guilds/:guildId/mods/:userId', loadGuild, guildModExists, mod.get);
    globe.del('/guilds/:guildId/mods/:userId', loadGuild, continueSession, loadUser(), loadMyself, isOwner, guildModExists, mod.del);

};