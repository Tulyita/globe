/* global describe, it, expect */

'use strict';

var mongoose = require('mongoose');
var User = require('../../server/models/user');


describe('user', function() {


	/**
	 *
	 */
	describe('_id', function() {

		it('should accept an objectId', function(done) {
			var user = new User();
			user._id = mongoose.Types.ObjectId();
			user.validate(function(err) {
				expect(user._id).toBeTruthy();
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should erase an invalid value', function(done) {
			var user = new User();
			user._id = 123;
			user.validate(function(err) {
				expect(user._id).toBeFalsy();
				//expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('site', function() {

		it('should accept a valid site', function(done) {
			var user = new User();
			user.site = 'j';
			user.validate(function(err) {
				expect(err).toBeFalsy();
				done();
			})
		});

		it('should not accept an invalid site', function(done) {
			var user = new User();
			user.site = 'haha';
			user.validate(function(err) {
				expect(err).toBeTruthy();
				done();
			})
		});
	});


	/**
	 *
	 */
	describe('name', function() {

		it('should accept a valid name', function(done) {
			var user = new User();
			user.name = 'Rudu';
			user.validate(function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept na invalid name', function(done) {
			var user = new User();
			user.name = 'a';
			user.validate(function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('group', function() {

		it('should accept a valid value', function(done) {
			var user = new User();
			user.group = 'g';
			user.validate(function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			var user = new User();
			user.group = [1,2,3];
			user.validate(function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('avatar', function() {

		it('should accept a valid value', function(done) {
			var user = new User();
			user.avatar = 'http://site.com/avatar.jpg';
			user.validate(function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			var user = new User();
			user.avatar = 'not a url';
			user.validate(function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('ip', function() {

		it('should accept a valid ipv4 address', function(done) {
			var user = new User();
			user.ip = '66.249.64.0';
			user.validate(function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should accept a valid ipv6 address', function(done) {
			var user = new User();
			user.ip = '2001:db8:85a3::8a2e:370:7334';
			user.validate(function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			var user = new User();
			user.ip = 'not an ip address';
			user.validate(function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('registerDate', function() {

		it('should accept a valid value', function(done) {
			var user = new User();
			user.registerDate = new Date();
			user.validate(function(err) {
				expect(user.registerDate).toBeTruthy();
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should erase an invalid value', function(done) {
			var user = new User();
			user.registerDate = 'way not a date';
			user.validate(function(err) {
				expect(user.registerDate).toBeFalsy();
				//expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('loginDate', function() {

		it('should accept a valid value', function(done) {
			var user = new User();
			user.loginDate = new Date();
			user.validate(function(err) {
				expect(user.loginDate).toBeTruthy();
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should erase an invalid value', function(done) {
			var user = new User();
			user.loginDate = [1,2,3,4,5,6];
			user.validate(function(err) {
				expect(user.loginDate).toBeFalsy();
				//expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('guildId', function() {

		it('should accept a valid value', function(done) {
			var user = new User();
			user.guildId = mongoose.Types.ObjectId();
			user.validate(function(err) {
				expect(user.guildId).toBeTruthy();
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should erase an invalid value', function(done) {
			var user = new User();
			user.guildId = 'hie guis';
			user.validate(function(err) {
				expect(user.guildId).toBeFalsy();
				//expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('messages', function() {

		it('should accept a valid value', function(done) {
			var _id = mongoose.Types.ObjectId();
			var fromUserId = mongoose.Types.ObjectId();
			var date = new Date();

			var user = new User();
			user.messages = [{
				_id: _id,
				fromUserId: fromUserId,
				fromIp: '66.102.15.255',
				body: 'right back at ya',
				lastBody: 'hey there',
				date: date
			}];
			user.validate(function(err) {
				var obj =
				expect(user.messages.toObject()).toEqual([{
					_id: _id,
					fromUserId: fromUserId,
					fromIp: '66.102.15.255',
					body: 'right back at ya',
					lastBody: 'hey there',
					date: date
				}]);
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should set an invalid value to an empty array', function(done) {
			var user = new User();
			user.messages = 1509;
			user.validate(function(err) {
				expect(user.messages.toObject()).toEqual([]);
				//expect(err).toBeTruthy();
				done();
			});
		});


		/**
		 *
		 */
		describe('_id', function() {

			it('should accept an objectId', function(done) {
				var user = new User();
				user.messages = [{_id: mongoose.Types.ObjectId()}];
				user.validate(function(err) {
					expect(user.messages[0]._id).toBeTruthy();
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should erase an invalid value', function(done) {
				var user = new User();
				user._id = 123;
				user.validate(function(err) {
					expect(user.messages.toObject()).toEqual([]);
					//expect(err).toBeTruthy();
					done();
				});
			});
		});


		/**
		 *
		 */
		describe('fromUserId', function() {

			it('should accept an objectId', function(done) {
				var user = new User();
				user.messages = [{fromUserId: mongoose.Types.ObjectId()}];
				user.validate(function(err) {
					expect(user.messages[0].fromUserId).toBeTruthy();
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should erase an invalid value', function(done) {
				var user = new User();
				user.messages = [{fromUserId: 'invalid'}];
				user.validate(function(err) {
					expect(user.messages.toObject()).toEqual([null]);
					//expect(err).toBeTruthy();
					done();
				});
			});
		});


		/**
		 *
		 */
		describe('fromIp', function() {

			it('should accept a valid ipv4 address', function(done) {
				var user = new User();
				user.messages = [{fromIp: '12.249.64.0'}];
				user.validate(function(err) {
					expect(user.messages[0].fromIp).toEqual('12.249.64.0');
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should accept a valid ipv6 address', function(done) {
				var user = new User();
				user.messages = [{fromIp: '2001:0db8:85a3:0000:0000:8a2e:0370:7334'}];
				user.validate(function(err) {
					expect(user.messages[0].fromIp).toEqual('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should not accept an invalid value', function(done) {
				var user = new User();
				user.messages = [{fromIp: [1,2,3,'no ip here']}];
				user.validate(function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});


		/**
		 *
		 */
		describe('body', function() {

			it('should accept valid value', function(done) {
				var user = new User();
				user.messages = [{body: 'hello'}];
				user.validate(function(err) {
					expect(user.messages[0].body).toEqual('hello');
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should erase an invalid value', function(done) {
				var user = new User();
				user.messages = [{body: 'loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'}];
				user.validate(function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});



		/**
		 *
		 */
		describe('lastBody', function() {

			it('should accept valid value', function(done) {
				var user = new User();
				user.messages = [{lastBody: 'hello'}];
				user.validate(function(err) {
					expect(user.messages[0].lastBody).toEqual('hello');
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should erase an invalid value', function(done) {
				var user = new User();
				user.messages = [{lastBody: 'loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
					'oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'}];
				user.validate(function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});


		/**
		 *
		 */
		describe('date', function() {

			it('should accept valid value', function(done) {
				var user = new User();
				var date = new Date();
				user.messages = [{date: date}];
				user.validate(function(err) {
					expect(user.messages[0].date).toEqual(date);
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should erase an invalid value', function(done) {
				var user = new User();
				user.messages = [{date: 'this is not a date'}];
				user.validate(function(err) {
					expect(user.messages[0].date).toBeFalsy();
					//expect(err).toBeTruthy();
					done();
				});
			});
		});
	});







	
	describe('friends', function() {

		/**
		 *
		 */
		describe('_id', function() {

			it('should accept an objectId', function(done) {
				var user = new User();
				user.friends = [{_id: mongoose.Types.ObjectId()}];
				user.validate(function(err) {
					expect(user.friends[0]._id).toBeTruthy();
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should erase an invalid value', function(done) {
				var user = new User();
				user.friends = [{_id: 'yeahok'}];
				user.validate(function(err) {
					expect(user.friends.toObject()).toEqual([null]);
					//expect(err).toBeTruthy();
					done();
				});
			});
		});


		/**
		 *
		 */
		describe('site', function() {

			it('should accept a valid site', function(done) {
				var user = new User();
				user.friends = [{site: 'g'}];
				user.validate(function(err) {
					expect(err).toBeFalsy();
					done();
				})
			});

			it('should not accept an invalid site', function(done) {
				var user = new User();
				user.friends = [{site: 7}];
				user.validate(function(err) {
					expect(err).toBeTruthy();
					done();
				})
			});
		});


		/**
		 *
		 */
		describe('name', function() {

			it('should accept a valid name', function(done) {
				var user = new User();
				user.friends = [{name: 'badwolf'}];
				user.validate(function(err) {
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should not accept na invalid name', function(done) {
				var user = new User();
				user.friends = [{name: ''}];
				user.validate(function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});
	});
});