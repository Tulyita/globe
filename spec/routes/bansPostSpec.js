/*global beforeEach, afterEach, expect, it, describe */
'use strict';
/*
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var bansPost = require('../../server/routes/bansPost');

describe('bansPost', function() {

	beforeEach(function(done) {
		done();
	});

	afterEach(function() {
		mockgoose.reset();
	});

	it('should add mod field to the body', function() {
		var _id = mongoose.Types.ObjectId();
		var ban = {};
		var session = {
			_id: _id,
			name: 'Villa',
			site: 'j',
			group: 'm',
			extra: 'unrelated'
		};
		bansPost.populateMod(ban, session);
		expect(ban.mod).toEqual({_id: _id, name: 'Villa', site: 'j', group: 'm'});
	});

	it('should save a ban to mongo', function(done) {
		var req = {
			body: {
				type: 'silence',
				banAccount: true,
				banIp: true,
				ip: '67.195.160.76',
				privateInfo: {message: 'bla'},
				user: {
					name: 'el',
					site: 'j',
					group: 'u'
				}
			},
			session: {
				_id: mongoose.Types.ObjectId(),
				name: 'Villa',
				site: 'j',
				group: 'm',
				extra: 'unrelated'
			}
		};
		bansPost(req, {apiOut: function(err, resp) {
			expect(err).toBeFalsy();
			expect(resp).toBeTruthy();
			if(resp) {
				expect(resp.type).toEqual('silence');
				expect(resp.mod.name).toEqual('Villa');
				expect(resp.user.name).toEqual('el');
			}
			done();
		}});
	});

	it('should return an error if something goes wrong', function(done) {
		var req = {
			body: {
				hi: 'malformed request',
				type: 'wewewe'
			}
		};
		bansPost(req, {apiOut: function(err) {
			expect(err).toBeTruthy();
			done();
		}});
	});
});*/