'use strict';

var mongoose = require('mongoose');
var guildSchema = require('./schemas/ipBanSchema');

var IpBan = mongoose.model('IpBan', guildSchema);
module.exports = IpBan;