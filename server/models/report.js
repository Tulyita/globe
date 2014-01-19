var mongoose = require('mongoose');
var ReportSchema = require('./schemas/reportSchema');

var Report = mongoose.model('Report', ReportSchema);
module.exports = Report;