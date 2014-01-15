(/**
 * Create a session for a user based on their login status with other sites
 * Returns a token that can be used to continue this session for future requests
 * @param futurismServer
 */

function() {
	'use strict';

	var request = require('request');
	var fns = require('../../fns/fns');
	var session = require('../../fns/mongoSession');
	var async = require('async');
	var User = require('../../models/user');


	module.exports = function(req, res) {

		var verifiedData;
		var body = req.body;
		var valid;


		async.series([


			//--- send credentials to GameHub server to verify they are real
			function(callback) {
				body.ip = fns.getIp(req);
				body.game = 'futurism';
				body.pass = process.env.GAMEHUB_KEY;
				body.max_width = 0;
				body.max_height = 0;
				if(body.site === 'g') {
					body.user_id = body.guest_user_id;
					body.user_name = body.guest_user_name;
				}

				var authUrl = 'http://gamehub.jiggmin.com/login.php?' + fns.objToUrlParams(body);
				request(authUrl, function(err, resp, _valid_) {
					valid = _valid_;
					return callback(err);
				});
			},


			//--- parse the incoming data from GameHub
			function(callback) {
				try {
					verifiedData = JSON.parse(valid);
				}
				catch (e){
					return callback(e);
				}

				if(process.env.NODE_ENV === 'staging') {
					if(!verifiedData.beta) {
						return callback('You must be a member of our Beta Testers to access this.');
					}
				}

				return callback(null);
			},


			//--- save the user in the db
			function(callback) {
				var v = verifiedData;
				User.findByIdAndSave({
					_id: v.user_id,
					name: v.user_name,
					group: v.group,
					site: v.site
				}, callback);
			},


			//--- start the session
			function(callback) {
				var v = verifiedData;
				session.make({userId: v.user_id}, callback);
			}
		],


		//--- tell it to the world
		function(err, results) {
			if(err) {
				return res.apiOut(err, null);
			}

			var user = JSON.parse(JSON.stringify(results[2]));
			user.token = results[3].token;
			return res.apiOut(null, user);
		});
	};


}());












/*
 <?php

 require_once('../fns/all_fns.php');
 require_once('../fns/avatar_fns.php');
 require_once('../classes/auth/Auth.php');
 require_once('../classes/auth/ArmorAuth.php');
 require_once('../classes/auth/FaceAuth.php');
 require_once('../classes/auth/GuestAuth.php');
 require_once('../classes/auth/JiggAuth.php');
 require_once('../classes/auth/KongAuth.php');
 require_once('../classes/auth/NewgroundsAuth.php');
 require_once('../classes/auth/TrustedVars.php');
 require_once('../classes/auth/UntrustedVars.php');


 try {


 //find vars
 $untrusted = new UntrustedVars();
 $untrusted->site = find('site');
 $untrusted->site_user_id = find('user_id');
 $untrusted->site_user_name = find('user_name');
 $untrusted->token = find('token');
 $untrusted->game = find('game', 'unknown');
 $untrusted->avatar = find('avatar');
 $untrusted->ip = find('ip');
 $max_width = find('max_width', 25); //max avatar width
 $max_height = find('max_height', 25); //max avatar height


 //auth
 authorize_request();


 //sanity check
 if(!Sites::is_valid_site($untrusted->site)) {
 throw new Exception('Invalid site');
 }
 if($untrusted->site != Sites::GUEST) {
 if(!is_string($untrusted->site_user_name) || strlen($untrusted->site_user_name) < 2 || strlen($untrusted->site_user_name) > 35) {
 throw new Exception('Invalid user name');
 }
 }
 if($max_width < 0 || $max_width > 250) {
 $max_width = 25;
 }
 if($max_height < 0 || $max_height > 250) {
 $max_height = 25;
 }


 //connect to the war database
 $db = new DB();


 //try to verify the login info
 if($untrusted->site == Sites::KONGREGATE) {
 $auth = new KongAuth($untrusted);
 }
 else if($untrusted->site == Sites::ARMORGAMES) {
 $auth = new ArmorAuth($db, $untrusted);
 }
 else if($untrusted->site == Sites::NEWGROUNDS) {
 $auth = new NewgroundsAuth($untrusted);
 }
 else if($untrusted->site == Sites::JIGGMIN) {
 $auth = new JiggAuth($untrusted);
 }
 else if($untrusted->site == Sites::FACEBOOK) {
 $auth = new FaceAuth($untrusted);
 }
 else if($untrusted->site == Sites::GUEST) {
 $auth = new GuestAuth($untrusted);
 }
 else {
 throw new Exception('Site was not found');
 }

 $trusted = $auth->authorize();
 if(isset($trusted->error)) {
 throw new Exception('Authentication error: '.$trusted->error);
 }


 //check ip ban
 $result = $db->call('check_ip_ban', array($trusted->ip));
 if($result->num_rows > 0) {
 $row = $result->fetch_object();
 if($row->type == 'silence') {
 $trusted->silenced_until = $row->expire_time;
 }
 else {
 $message = format_ban_explanation($row);
 throw new Exception($message);
 }
 }


 //curtail brute force attacks
 $result = $db->call('count_failed_logins', array($trusted->ip));
 $row = $result->fetch_object();
 $failed_logins = $row->login_count;
 if($failed_logins > 5) {
 throw new Exception('You have failed to log in more than five times. Wait a while before trying again.');
 }


 //record this login attempt
 $result = $db->call('record_login_attempt', array($trusted->ip));


 //do the login
 $result = $db->call('user_login', array($trusted->site, $trusted->site_user_id, $trusted->site_user_name, $trusted->ip, $trusted->power));
 if($result->num_rows != 1) {
 throw new Exception('Odd error. '.$result->num_rows);
 }

 $row = $result->fetch_object();
 $user_id = $row->user_id;
 $old_avatar = $row->remote_avatar;
 $avatar_version = $row->avatar_version;


 //update the avatar
 if($old_avatar != $trusted->avatar) {
 $avatar_version++;
 $result = $db->call('user_update_avatar', array($user_id, $trusted->avatar));
 }


 //create the url of a local avatar
 $local_avatar = get_local_avatar($user_id, $max_width, $max_height, $avatar_version);


 //check account ban
 $result = $db->call('check_account_ban', array($user_id));
 if($result->num_rows > 0) {
 $row = $result->fetch_object();
 if($row->type == 'silence') {
 $trusted->silenced_until = $row->expire_time;
 }
 else {
 $message = format_ban_explanation($row);
 throw new Exception($message);
 }
 }


 //clear any failed login attempts, since the login was successfull
 $result = $db->call('delete_failed_logins', array($trusted->ip));


 //create our response
 $response = new stdClass();
 $response->success = true;
 $response->user_id = $user_id;
 $response->user_name = $trusted->site_user_name;
 $response->avatar = $local_avatar; //$trusted->avatar
 $response->avatar_version = $avatar_version;
 $response->silenced_until = $trusted->silenced_until;
 $response->site = $trusted->site;
 $response->power = $trusted->power;
 $response->site_user_id = $trusted->site_user_id;
 if($trusted->beta) {
 $response->beta = $trusted->beta;
 }
 }


 catch(Exception $e){
 //create an error response
 $response = new stdClass();
 $response->success = false;
 $response->error = $e->getMessage();
 }


 //output our response
 echo json_encode($response);

 ?>
 */