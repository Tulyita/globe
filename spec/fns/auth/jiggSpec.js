'use strict';

var request = require('request');
var sinon = require('sinon');
var jigg = require('../../../server/fns/auth/jigg');


describe('jigg', function() {


	///////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////

	describe('powerToGroup', function() {

		it('should convert 0 to g', function() {
			expect(jigg.powerToGroup(0)).toBe('g');
		});

		it('should convert 1 to u', function() {
			expect(jigg.powerToGroup(1)).toBe('u');
		});

		it('should convert 2 to m', function() {
			expect(jigg.powerToGroup(2)).toBe('m');
		});

		it('should convert 3 to a', function() {
			expect(jigg.powerToGroup(3)).toBe('a');
		});
	});


	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////

	describe('authenticate', function() {

		beforeEach(function() {
			sinon.stub(request, 'post');
		});

		afterEach(function() {
			request.post.restore();
		});

		it('should yield data from auth url', function() {
			request.post
				.withArgs('https://jiggmin.com/-use-login-token.php', {form: {token: '123'}})
				.yields(null, 'HTTP response', JSON.stringify({user_name: 'aaaa', user_id: 434, avatar: 'http://jiggmin.com/avatar.jpg', power: 1, beta: true}));

			var data = {
				jiggToken: '123'
			};
			var callback = sinon.stub();
			jigg.authenticate(data, callback);
			expect(callback.args[0]).toEqual([null, {name: 'aaaa', site: 'j', siteUserId: 434, avatar: 'http://jiggmin.com/avatar.jpg', group: 'u', beta: true}]);
		});

		it('should yield an error if auth site returns an error in the body', function() {
			request.post
				.withArgs('https://jiggmin.com/-use-login-token.php', {form: {token: '44'}})
				.yields(null, 'HTTP response', JSON.stringify({error: 'oh my'}));

			var data = {
				jiggToken: '44'
			};
			var callback = sinon.stub();
			jigg.authenticate(data, callback);
			expect(callback.args[0]).toEqual(['Jiggmin login token was not accepted: oh my']);
		});

		it('should yield an error if request.post yields and error', function() {
			request.post
				.withArgs('https://jiggmin.com/-use-login-token.php', {form: {token: '44'}})
				.yields('http error');

			var data = {
				jiggToken: '44'
			};
			var callback = sinon.stub();
			jigg.authenticate(data, callback);
			expect(callback.args[0]).toEqual(['http error']);
		});

		it('should yield an error if your jiggmin.com account is banned', function() {
			request.post
				.withArgs('https://jiggmin.com/-use-login-token.php', {form: {token: '44'}})
				.yields(null, 'HTTP response', JSON.stringify({banned: true, user_name: 'aaaa', user_id: 434, avatar: 'http://jiggmin.com/avatar.jpg', power: 1, beta: true}));

			var data = {
				jiggToken: '44'
			};
			var callback = sinon.stub();
			jigg.authenticate(data, callback);
			expect(callback.args[0]).toEqual(['Your account on jiggmin.com has been banned.']);
		});
	});
});