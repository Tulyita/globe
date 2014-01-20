'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var User = require('../../server/models/user');
var messagesPost = require('../../server/routes/messagesPost');
var me, toUserId;


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
			var message = messagesPost.formMessage(req);
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

			messagesPost.saveMessage(toUserId, message, function(err) {
				expect(err).toBeFalsy();

				message._id = mongoose.Types.ObjectId();
				messagesPost.saveMessage(toUserId, message, function(err) {
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