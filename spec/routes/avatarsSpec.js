'use strict';

var sinon = require('sinon');
var gm = require('gm').subClass({ imageMagick: true });
var avatars = require('../../server/routes/avatars');
var User = require('../../server/models/user');


describe('avatars', function() {


	//////////////////////////////////////////////////
	////////////////////////////////////////////////
	//////////////////////////////////////////////

	describe('parseValues', function() {

		it('should pull values from properly encoded string', function() {
			expect(avatars.parseValues('123abc-15x45.gif')).toEqual({userId: '123abc', width: 15, height: 45});
		});

		it('should return default values for an improperly formatted string', function() {
			expect(avatars.parseValues('justwords')).toEqual({userId: 'justwords', width: 12, height: 12});
		});
	});


	/////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	/////////////////////////////////////////////////

	describe('resizeImage', function() {

		it('should resize and crop an image to the specified size', function(done) {
			gm('spec/routes/205x50.png').toBuffer(function(err, buffer) {
				expect(err).toBeFalsy();

				avatars.resizeImage(buffer, 50, 45, function(err, resizedBuffer) {
					expect(err).toBeFalsy();

					gm(resizedBuffer).size(function(err, size) {
						expect(err).toBeFalsy();
						expect(size).toBeTruthy();
						if(size) {
							expect(size.width).toBe(50);
							expect(size.height).toBe(45);
						}
						done();
					});
				});
			});
		});

		it('should not scale an image up', function(done) {
			gm('spec/routes/205x50.png').toBuffer(function(err, buffer) {
				expect(err).toBeFalsy();

				avatars.resizeImage(buffer, 500, 600, function(err, resizedBuffer) {
					expect(err).toBeFalsy();

					gm(resizedBuffer).size(function(err, size) {
						expect(err).toBeFalsy();
						expect(size).toBeTruthy();
						if(size) {
							expect(size.width).toBe(205);
							expect(size.height).toBe(50);
						}
						done();
					});
				});
			});
		});

		it('should work when one of the numbers is larger than the image', function(done) {
			gm('spec/routes/61x80.gif').toBuffer(function(err, buffer) {
				expect(err).toBeFalsy();

				avatars.resizeImage(buffer, 10, 500, function(err, resizedBuffer) {
					expect(err).toBeFalsy();

					gm(resizedBuffer).size(function(err, size) {
						expect(err).toBeFalsy();
						expect(size).toBeTruthy();
						if(size) {
							expect(size.width).toBe(10);
							expect(size.height).toBe(80);
						}
						done();
					});
				});
			});
		});
	});


	//////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////

	describe('get', function() {

		beforeEach(function() {
			sinon.stub(User, 'findById');
			User.findById
				.withArgs('abc')
				.yields(null, {avatar: 'spec/routes/205x50.png'});
			User.findById
				.withArgs()
				.yields(null);
		});

		afterEach(function() {
			User.findById.restore();
		});

		it('should reply with an image', function(done) {
			var req = {
				params: {
					filename: 'abc-50x50.gif'
				}
			};
			avatars.get(req, {
				writeHead: function(httpCode, contentType) {
					expect(httpCode).toBe(200);
					expect(contentType['Content-Type']).toBe('image/gif');
				},
				end: function(data, type) {
					expect(data instanceof Buffer).toBe(true);
					expect(type).toBe('binary');
					done();
				},
				apiOut: function(err, response) {
					expect(err).toBeFalsy();
					expect(response).toBeFalsy();
					done();
				}
			});
		});

		it('should reply with a not found message if the user does not exist', function(done) {
			var req = {
				params: {
					filename: 'zzz-50x50.gif'
				}
			};
			avatars.get(req, {
				apiOut: function(err) {
					expect(err).toBeTruthy();
					done();
				}
			});
		});
	});
});