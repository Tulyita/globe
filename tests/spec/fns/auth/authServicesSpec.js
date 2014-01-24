'use strict';

var sinon = require('sinon');
var authServices = require('../../../../server/fns/auth/authServices');

describe('authServices', function() {


	///////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	describe('authenticate', function() {

		beforeEach(function() {
			var jiggAuth = {
				authenticate: sinon.stub()
			};
			jiggAuth.authenticate
				.withArgs({site: 'j', jiggToken: 'abc'})
				.yields(null, {siteUserId: '1', name: 'bob', site: 'j', group: 'u'});
			jiggAuth.authenticate
				.withArgs({site: 'j', jiggToken: 'zzz'})
				.yields(null, {notRight: true});

			sinon.stub(authServices, 'siteToAuth')
				.withArgs('j')
				.returns(jiggAuth);
		});

		afterEach(function() {
			authServices.siteToAuth.restore();
		});

		it('should yield the result from an authenticator function', function() {
			var data = {
				site: 'j',
				jiggToken: 'abc'
			};
			var callback = sinon.stub();
			authServices.authenticate(data, callback);
			expect(callback.args[0]).toEqual([null, {siteUserId: '1', name: 'bob', site: 'j', group: 'u'}]);
		});

		it('should yield an error for an unknown site', function() {
			var data = {
				site: 'u',
				jiggToken: 'abc'
			};
			var callback = sinon.stub();
			authServices.authenticate(data, callback);
			expect(callback.args[0]).toEqual(['site not found']);
		});

		it('should yield an error if the validator does not return the correct values', function() {
			var data = {
				site: 'j',
				jiggToken: 'zzz'
			};
			var callback = sinon.stub();
			authServices.authenticate(data, callback);
			expect(callback.args[0]).toEqual(['Name, site, siteUserId, and group are required from auth.']);
		});
	});
});