/* global describe, it, expect */

'use strict';

var mongoose = require('mongoose');
var User = require('../../server/models/user');
require('../../server/fns/mongoose/vValidate').attach(mongoose);


describe('user', function() {


	/**
	 *
	 */
	describe('_id', function() {

		it('should accept an objectId', function(done) {
			User.vValidate({_id: mongoose.Types.ObjectId()}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			User.vValidate({_id: 123}, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('site', function() {

		it('should accept a valid site', function(done) {
			User.vValidate({site: 'j'}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid site', function(done) {
			User.vValidate({site: 'haha'}, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('name', function() {

		it('should accept a valid value', function(done) {
			User.vValidate({name: 'rudu'}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			User.vValidate({site: 'a'}, function(err) {
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
			User.vValidate({group: 'g'}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			User.vValidate({group: [1,2,3]}, function(err) {
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
			User.vValidate({avatar: 'https://site.com/img.jpg'}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			User.vValidate({avatar: 'not an avatar'}, function(err) {
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
			User.vValidate({ip: '66.249.64.0'}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should accept a valid value', function(done) {
			User.vValidate({ip: '2001:db8:85a3::8a2e:370:7334'}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			User.vValidate({ip: 'not an ip address'}, function(err) {
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
			User.vValidate({registerDate: new Date()}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			User.vValidate({registerDate: 'not a date'}, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('loginDate', function() {

		it('should accept a valid value', function(done) {
			User.vValidate({loginDate: new Date()}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			User.vValidate({loginDate: {}}, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('guildId', function() {

		it('should accept a valid value', function(done) {
			User.vValidate({guildId: mongoose.Types.ObjectId()}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			User.vValidate({guildId: false}, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	/**
	 *
	 */
	describe('messages', function() {

		it('should accept a valid value', function(done) {

			User.vValidate({messages: [{
				_id: mongoose.Types.ObjectId(),
				fromUserId: mongoose.Types.ObjectId(),
				fromIp: '66.102.15.255',
				body: 'right back at ya',
				date: new Date()
			}]}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			User.vValidate({messages: 1509}, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});


		/**
		 *
		 */
		describe('_id', function() {

			it('should accept a valid value', function(done) {
				User.vValidate({messages: [{_id: mongoose.Types.ObjectId()}]}, function(err) {
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should not accept an invalid value', function(done) {
				User.vValidate({messages: [{_id: 123}]}, function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});


		/**
		 *
		 */
		describe('fromUserId', function() {

			it('should accept a valid value', function(done) {
				User.vValidate({messages: [{fromUserId: mongoose.Types.ObjectId()}]}, function(err) {
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should not accept an invalid value', function(done) {
				User.vValidate({messages: [{fromUserId: 'happy patty'}]}, function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});


		/**
		 *
		 */
		describe('fromIp', function() {

			it('should accept a valid value', function(done) {
				User.vValidate({messages: [{fromIp: '2001:0db8:85a3:0000:0000:8a2e:0370:7334'}]}, function(err) {
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should not accept an invalid value', function(done) {
				User.vValidate({messages: [{fromIp: 'not an ip'}]}, function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});


		/**
		 *
		 */
		describe('body', function() {

			it('should accept a valid value', function(done) {
				User.vValidate({messages: [{body: 'hello'}]}, function(err) {
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should not accept an invalid value', function(done) {
				User.vValidate({messages: [{body: [1,2,3]}]}, function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});


		/**
		 *
		 */
		describe('date', function() {

			it('should accept a valid value', function(done) {
				User.vValidate({messages: [{date: new Date()}]}, function(err) {
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should not accept an invalid value', function(done) {
				User.vValidate({messages: [{date: ':)'}]}, function(err) {
					expect(err).toBeTruthy();
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

			it('should accept a valid value', function(done) {
				User.vValidate({friends: [{_id: mongoose.Types.ObjectId()}]}, function(err) {
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should not accept an invalid value', function(done) {
				User.vValidate({freinds: [{_id: 123}]}, function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});


		/**
		 *
		 */
		describe('site', function() {

			it('should accept a valid value', function(done) {
				User.vValidate({friends: [{site: 'g'}]}, function(err) {
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should not accept an invalid value', function(done) {
				User.vValidate({freinds: [{site: 123}]}, function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});


		/**
		 *
		 */
		describe('name', function() {

			it('should accept a valid value', function(done) {
				User.vValidate({friends: [{name: 'badwold'}]}, function(err) {
					expect(err).toBeFalsy();
					done();
				});
			});

			it('should not accept an invalid value', function(done) {
				User.vValidate({freinds: [{name: ''}]}, function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});
	});
});