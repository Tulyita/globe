'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var guildsPost = require('../../server/routes/guildsPost');
var session;

describe('guildsPost', function() {

	beforeEach(function() {
		session = {
			_id: mongoose.Types.ObjectId(),
			name: 'Sue',
			site: 'j',
			group: 'u'
		}
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('post', function() {

		it('should create a new guild', function(done) {
			var req = {
				body: {
					guildId: 'turtle'
				},
				session: session
			};
			guildsPost.post(req, {apiOut: function(err, res) {
				expect(err).toBeFalsy();
				expect(res._id).toEqual('turtle');
				expect(res.owners[0]._id).toEqual(session._id);
				expect(res.members[0]._id).toEqual(session._id);
				done();
			}});
		});
	});
});