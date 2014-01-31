var md5 = require('crypto').createHash('md5');
var request = require('request');
var passwords = require('./passwords');
var jiggPassHash = md5.update(passwords.jiggPass).digest('hex');

var loginData = {
	vb_login_username: passwords.jiggUser,
	vb_login_password: '',
	vb_login_password_hint: 'Password',
	s: '',
	securitytoken: 'guest',
	do: 'login',
	vb_login_md5password: jiggPassHash,
	vb_login_md5password_utf: jiggPassHash
};

module.exports = function(callback) {
	request.post('https://jiggmin.com/login.php', {form: loginData, jar: true}, function (err, response, body) {
		if(err) {
			return callback(err);
		}
		if(response.statusCode !== 200) {
			return callback('Jigg login got response code ' + response.statusCode);
		}
		return callback();
	});
};