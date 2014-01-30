'use strict';

var mongoose = require('mongoose');

var Apprentice = mongoose.model('Apprentice', require('./schemas/apprenticeSchema'));
module.exports = Apprentice;