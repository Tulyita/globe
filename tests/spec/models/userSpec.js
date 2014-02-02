'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var _ = require('lodash');
var User = require('../../../server/models/user');

describe('user', function() {

	beforeEach(function() {
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('validation', function() {


		it('should accept valid values', function(done) {
			var obj = {
				_id: mongoose.Types.ObjectId(),
				name: 'aaaa',
				site: 'j',
				group: 'u',
				siteUserId: '123',
				avatar: 'https://site.com/img.png',
				ip: '2607:f0d0:1002:51::4',
				registerDate: new Date(1),
				loginDate: new Date(2),
				guild: 'hi',
				messages: [{
					_id: mongoose.Types.ObjectId(),
					ip: '139.130.4.5',
					fromUser: {
						_id: mongoose.Types.ObjectId(),
						name: 'bob',
						site: 'j',
						group: 'u'
					},
					toUser: {
						_id: mongoose.Types.ObjectId(),
						name: 'sue',
						site: 'k',
						group: 'm'
					},
					date: new Date(3),
					body: 'hi'
				}],
				friends: [{
					_id: mongoose.Types.ObjectId(),
					name: 'bob',
					site: 'j',
					group: 'u'
				}],
				bans: [{
					_id: mongoose.Types.ObjectId(),
					ip: '139.130.4.5',
					mod: {
						_id: mongoose.Types.ObjectId(),
						name: 'bob',
						site: 'j',
						group: 'm'
					},
					date: new Date(40),
					expireDate: new Date(50),
					reason: 'boobs',
					type: 'silence'
				}]
			};

			User.create(obj, function(err, user) {
				expect(err).toBeFalsy();
				expect(user._id).toEqual(obj._id);
				expect(user.name).toBe(obj.name);
				expect(user.site).toBe(obj.site);
				expect(user.group).toBe(obj.group);
				expect(user.siteUserId).toBe(obj.siteUserId);
				expect(user.avatar).toBe(obj.avatar);
				expect(user.ip).toBe(obj.ip);
				expect(user.registerDate).toBe(obj.registerDate);
				expect(user.loginDate).toBe(obj.loginDate);
				expect(user.guild).toBe(obj.guild);
				expect(user.messages.toObject()).toEqual(obj.messages);
				expect(user.friends.toObject()).toEqual(obj.friends);
				expect(user.bans.toObject()).toEqual(obj.bans);
				done(err);
			});
		});


		it('should return an error for invalid values', function(done) {
			var obj = {
				site: 'wat',
				name: '',
				group: true,
				siteUserId: '',
				avatar: true,
				ip: true
			};

			User.create(obj, function(err) {
				expect(err).toMatch('Validator failed');
				expect(err).toMatch('site');
				expect(err).toMatch('name');
				expect(err).toMatch('group');
				expect(err).toMatch('siteUserId');
				expect(err).toMatch('avatar');
				expect(err).toMatch('ip');
				done();
			});
		});


		it('should fix what it can using typecasting and defaults', function(done) {
			var obj = {

				// required valid values
				_id: mongoose.Types.ObjectId(),
				name: 'aaaa',
				site: 'j',
				group: 'u',
				siteUserId: '123',

				// invalid values
				loginIp: {haxxor: true},
				registerDate: {haxor: true},
				loginDate: {haxor: true},
				guild: {haxor: true},
				messages: {haxxor: true},
				friends: {haxor: true},
				bans: {haxor: true}
			};

			User.create(obj, function(err, user) {
				expect(err).toBeFalsy();
				expect(user.loginIp).toBe(undefined);
				expect(_.isDate(user.registerDate)).toBe(true);
				expect(_.isDate(user.loginDate)).toBe(true);
				expect(user.guild).toBe(undefined);
				expect(user.messages.toObject()).toEqual([]);
				expect(user.friends.toObject()).toEqual([]);
				expect(user.bans.toObject()).toEqual([]);
				done(err);
			});
		});


		it('should bubble up errors from messages', function(done) {
			var obj = {

				// required valid values
				_id: mongoose.Types.ObjectId(),
				name: 'aaaa',
				site: 'j',
				group: 'u',
				siteUserId: '123',

				// invalid values
				messages: [{
					soWrong: true
				}]
			};

			User.create(obj, function(err) {
				err = JSON.stringify(err);
				expect(err).toMatch('ValidationError');
				expect(err).toMatch('messages.0.*');
				done();
			});
		});


		it('should bubble up errors from bans', function(done) {
			var obj = {

				// required valid values
				_id: mongoose.Types.ObjectId(),
				name: 'aaaa',
				site: 'j',
				group: 'u',
				siteUserId: '123',

				// invalid values
				bans: [1, 2, 3]
			};

			User.create(obj, function(err) {
				// mongoose seems to return an empty object as an error here...
				expect(err).toBeTruthy();
				done();
			});
		});


		it('should bubble up errors from friends', function(done) {
			var obj = {

				// required valid values
				_id: mongoose.Types.ObjectId(),
				name: 'aaaa',
				site: 'j',
				group: 'u',
				siteUserId: '123',

				// invalid values
				friends: [{
					soWrong: true
				}]
			};

			User.create(obj, function(err) {
				err = JSON.stringify(err);
				expect(err).toMatch('ValidationError');
				expect(err).toMatch('friends.0.*');
				done();
			});
		});
	});
});