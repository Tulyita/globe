'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var validateSite = [function(val) {
	return ['g', 'j'].indexOf(val) !== -1;
}, 'Site must be g or j.'];

var validateName = [function(val) {
	return (val.length >= 3 && val.length <= 40);
}, 'Name must be between 3 and 40 characters.'];

var validateSiteUserId = [function(val) {
	return (val.length >= 3 && val.length <= 40);
}, 'SiteUserId must be between 3 and 40 characters.'];

var validateGroup = [function(val) {
	return ['g', 'u', 'm', 'a'].indexOf(val) !== -1;
}, 'Group must be g, u, m, or a.'];

var validateAvatar = [function(val) {
	var isUrl = /^(http:\/\/)|(https:\/\/)/.test(val);
	return (val.length >= 0 && val.length <= 100 && isUrl);
}, 'Avatar must be a url between 0 and 100 characters.'];

var validateMessageBody = [function(val) {
	return (val.length > 0 && val.length <= 300);
}, 'Message body must be between 0 and 300 characters'];

var validateIp = [function(val) {
	var isIpv6 = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i.test(val);
	var isIpv4 = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$){4}\b/.test(val);
	return isIpv6 || isIpv4;
}, 'Ip must be a valid ipv4 or ipv6 address.'];



var UserSchema = new Schema({
	site: {type: String, validate: validateSite},
	name: {type: String, validate: validateName},
	group: {type: String, validate: validateGroup},
	avatar: {type: String, validate: validateAvatar},
	siteUserId: {type: String, validate: validateSiteUserId},
	ip: {type: String, validate: validateIp},
	registerDate: Date,
	loginDate: Date,
	silencedUntil: Date,
	bannedUntil: Date,
	guildId: Schema.Types.ObjectId,
	messages: [{
		fromUserId: Schema.Types.ObjectId,
		fromIp: {type: String, validate: validateIp},
		body: {type: String, validate: validateMessageBody},
		date: Date
	}],
	friends: [{
		site: {type: String, validate: validateSite},
		name: {type: String, validate: validateName}
	}]
});

var User = mongoose.model('User', UserSchema);
module.exports = User;