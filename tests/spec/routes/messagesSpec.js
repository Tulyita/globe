'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var User = require('../../../server/models/user');
var msgs = require('../../../server/routes/messages');
var me, toUserId;


describe('messages', function() {

	describe('get', function() {

		var messages, fromUserId, toUserId;

		beforeEach(function(done) {
			fromUserId = mongoose.Types.ObjectId();
			toUserId = mongoose.Types.ObjectId();
			messages = [{
				_id: mongoose.Types.ObjectId(),
				fromUser: {
					_id: fromUserId,
					name: 'fred',
					site: 'j',
					group: 'u'
				},
				body: 'hello',
				date: new Date()
			}];

			User.create({
				_id: toUserId,
				name: 'aaaa',
				site: 'j',
				group: 'u',
				siteUserId: 'abc',
				messages: messages
			}, function(err) {
				done(err);
			});
		});

		afterEach(function() {
			mockgoose.reset();
		});

		it('should return a uers messages', function(done) {
			var req = {
				session: {
					_id: toUserId
				}
			};
			msgs.get(req, {apiOut: function(err, res) {
				if(err) {
					return done(err);
				}
				expect(res.toObject()).toEqual(messages);
				return done();
			}});
		});
	});
});


describe('messagesPost', function() {


	beforeEach(function(done) {
		me = {
			_id: mongoose.Types.ObjectId(),
			name: 'aaaa',
			site: 'j',
			group: 'u'
		};

		toUserId = mongoose.Types.ObjectId();

		User.create({
			_id: toUserId,
			siteUserId: '123',
			site: 'j',
			name: 'Alph',
			group: 'u'
		}, function() {
			done();
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('formMessage', function() {

		it('should form a message using data from the request', function() {
			var req = {
				body: {body: 'hi'},
				session: me,
				connection: {remoteAddress: '12.52.251.0'}
			};
			var message = msgs.formMessage(req);
			expect(message).toEqual({body: 'hi', fromUser: me, ip: '12.52.251.0', date: message.date, _id: message._id});
		});
	});


	describe('saveMessage', function() {

		it('should push a message into a user document', function(done) {
			var message = {
				_id: mongoose.Types.ObjectId(),
				body: 'hi',
				fromUser: me,
				ip: '12.52.251.0',
				date: new Date()
			};

			msgs.saveMessage(toUserId, message, function(err) {
				expect(err).toBeFalsy();

				message._id = mongoose.Types.ObjectId();
				msgs.saveMessage(toUserId, message, function(err) {
					expect(err).toBeFalsy();

					User.findById(toUserId, function(err, user) {
						expect(err).toBeFalsy();
						if(user && user.messages && user.messages[0]) {
							expect(user.messages[0].body).toBe('hi');
							expect(user.messages[1]._id).toEqual(message._id);
						}
						done();
					});
				});
			});
		});
	});

});