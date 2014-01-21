'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Guild = require('../../server/models/guild');
var guildsPatch = require('../../server/routes/guildsPatch');
var ownerId;

describe('guildsPatch', function() {

	beforeEach(function(done) {
		ownerId = mongoose.Types.ObjectId();
		Guild.create({
			_id: 'abc',
			join: 'inviteOnly',
			owners: [{
				_id: ownerId,
				name: 'bob',
				site: 'j',
				group: 'u'
			}]
		}, function(err) {
			done(err)
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	it('should update an existing guild', function(done) {
		var req = {
			body: {
				guildId: 'abc',
				join: 'requestToJoin'
			},
			session: {
				_id: ownerId
			}
		};
		guildsPatch(req, {apiOut: function(err) {
			expect(err).toBeFalsy();

			Guild.findById('abc', function(err, doc) {
				expect(doc.join).toBe('requestToJoin');
			});

			done();
		}});
	});


	it('should not update if you are not an owner', function(done) {
		var req = {
			body: {
				guildId: 'abc',
				join: 'requestToJoin'
			},
			session: {
				_id: mongoose.Types.ObjectId()
			}
		};
		guildsPatch(req, {apiOut: function(err) {
			expect(err).toBeTruthy();
			done();
		}});
	});


	it('should return an error of the guild does not exist', function(done) {
		var req = {
			body: {
				guildId: 'zzz',
				join: 'requestToJoin'
			},
			session: {
				_id: ownerId
			}
		};
		guildsPatch(req, {apiOut: function(err) {
			expect(err).toBeTruthy();
			done();
		}});
	});
});