/* global describe, it, expect */

'use strict';
describe('session', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var SessionGoose = require('../../server/models/session');


	it('should save a valid document', function(done) {
		SessionGoose.create({_id: '1111111111111111111111111111111111111111', value: 'bla'}, function(err, doc) {
			expect(err).toBe(null);
			expect(doc.value).toBe('bla');
			done();
		});
	});


	it('should not save a document with no _id', function(done) {
		SessionGoose.create({value: 'weeee'}, function(err) {
			expect(err).toBeTruthy();
			done();
		});
	});

});