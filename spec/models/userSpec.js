'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var _ = require('lodash');
var User = require('../../server/models/user');
var obj;

describe('user', function() {

	beforeEach(function() {
		obj = {
			_id: mongoose.Types.ObjectId(),
			name: 'aaaa',
			site: 'j',
			group: 'u',
			siteUserId: '123'
		};
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('site', function() {

		it('should accept a valid value', function(done) {
			obj.site = 'g';
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.site).toBe('g');
				done();
			});
		});

		it('should reject an invalid value', function(done) {
			obj.site = ['wat'];
			User.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('name', function() {

		it('should accept a valid value', function(done) {
			obj.name = 'alfie';
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.name).toBe('alfie');
				done();
			});
		});

		it('should reject an invalid value', function(done) {
			obj.name = '';
			User.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('group', function() {

		it('should accept a valid value', function(done) {
			obj.group = 'a';
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.group).toBe('a');
				done();
			});
		});

		it('should reject an invalid value', function(done) {
			obj.group = true;
			User.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('siteUserId', function() {

		it('should accept a valid value', function(done) {
			obj.siteUserId = 'ppddss';
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.siteUserId).toBe('ppddss');
				done();
			});
		});

		it('should reject an invalid value', function(done) {
			obj.siteUserId = '';
			User.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('avatar', function() {

		it('should accept a valid value', function(done) {
			obj.avatar = 'https://site.com/img.png';
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.avatar).toBe('https://site.com/img.png');
				done();
			});
		});

		it('should reject an invalid value', function(done) {
			obj.avatar = true;
			User.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('registerIp', function() {

		it('should accept a valid value', function(done) {
			obj.registerIp = '2607:f0d0:1002:51::4';
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.registerIp).toBe('2607:f0d0:1002:51::4');
				done();
			});
		});

		it('should reject an invalid value', function(done) {
			obj.registerIp = true;
			User.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('loginIp', function() {

		it('should accept a valid value', function(done) {
			obj.loginIp = '69.147.76.15';
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.loginIp).toBe('69.147.76.15');
				done();
			});
		});

		it('should reject an invalid value', function(done) {
			obj.loginIp = {haxor: true};
			User.create(obj, function(err, doc) {
				expect(doc.loginIp).toBe(undefined);
				done();
			});
		});
	});


	describe('registerDate', function() {

		it('should accept a valid value', function(done) {
			obj.registerDate = new Date(1);
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.registerDate).toEqual(new Date(1));
				done();
			});
		});

		it('should use a default date if value is invalid', function(done) {
			obj.registerDate = {haxor: true};
			User.create(obj, function(err, doc) {
				expect(_.isDate(doc.registerDate)).toBe(true);
				done();
			});
		});
	});


	describe('loginDate', function() {

		it('should accept a valid value', function(done) {
			obj.loginDate = new Date(2);
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.loginDate).toEqual(new Date(2));
				done();
			});
		});

		it('should use a default date if value is invalid', function(done) {
			obj.loginDate = {haxor: true};
			User.create(obj, function(err, doc) {
				expect(_.isDate(doc.loginDate)).toBe(true);
				done();
			});
		});
	});


	describe('guildId', function() {

		it('should accept a valid value', function(done) {
			var id = mongoose.Types.ObjectId();
			obj.guildId = id;
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.guildId).toEqual(id);
				done();
			});
		});

		it('should reject an invalid value', function(done) {
			obj.guildId = {haxor: true};
			User.create(obj, function(err, doc) {
				expect(doc.guildId).toBe(undefined);
				done();
			});
		});
	});


	describe('message', function() {

		it('should accept a valid value', function(done) {
			var messages = [{
				_id: mongoose.Types.ObjectId(),
				ip: '139.130.4.5',
				fromUser: {
					_id: mongoose.Types.ObjectId(),
					name: 'bob',
					site: 'j',
					group: 'u'
				},
				date: new Date(),
				body: 'hi'
			}];
			obj.messages = messages;
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.messages.toObject()).toEqual(messages);
				done();
			});
		});

		it('should remove an invalid value', function(done) {
			obj.messages = {haxor: true};
			User.create(obj, function(err, doc) {
				expect(doc.messages.toObject()).toEqual([]);
				done();
			});
		});

		it('should reject an invalid sub-value', function(done) {
			obj.messages = [{
				_id: mongoose.Types.ObjectId(),
				ip: '139.130.4.5',
				fromUser: {
					_id: mongoose.Types.ObjectId(),
					name: 'bob',
					site: 'super invalid site',
					group: 'u'
				},
				date: new Date(),
				body: 'hi'
			}];
			User.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});

		it('should not insert extra fields', function(done) {
			var messages = [{
				_id: mongoose.Types.ObjectId(),
				ip: '139.130.4.5',
				fromUser: {
					_id: mongoose.Types.ObjectId(),
					name: 'bob',
					site: 'j',
					group: 'u'
				},
				date: new Date(),
				body: 'hi',
				extra: 'yup'
			}];
			obj.messages = messages;
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.messages.toObject()[0].body).toBe('hi');
				expect(doc.messages.toObject()[0].extra).toBe(undefined);
				done();
			});
		});
	});


	describe('friends', function() {
		it('should accept a valid value', function(done) {
			var friends = [{
				_id: mongoose.Types.ObjectId(),
				name: 'bob',
				site: 'j',
				group: 'u'
			}];
			obj.friends = friends;
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.friends.toObject()).toEqual(friends);
				done();
			});
		});

		it('should remove an invalid value', function(done) {
			obj.friends = {haxor: true};
			User.create(obj, function(err, doc) {
				expect(doc.friends.toObject()).toEqual([]);
				done();
			});
		});
	});


	describe('bans', function() {

		it('should accept a valid value', function(done) {
			var bans = [{
				_id: mongoose.Types.ObjectId(),
				ip: '139.130.4.5',
				mod: {
					_id: mongoose.Types.ObjectId(),
					name: 'bob',
					site: 'j',
					group: 'm'
				},
				date: new Date(),
				expireDate: new Date(),
				reason: 'boobs',
				type: 'silence'
			}];
			obj.bans = bans;
			User.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.bans.toObject()).toEqual(bans);
				done();
			});
		});

		it('should remove an invalid value', function(done) {
			obj.bans = {haxor: true};
			User.create(obj, function(err, doc) {
				expect(doc.bans.toObject()).toEqual([]);
				done();
			});
		});
	});
});