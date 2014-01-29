'use strict';

var mongoose = require('mongoose');
var guildSchema = require('./schemas/guildSchema');

var Guild = mongoose.model('Guild', guildSchema);
module.exports = Guild;