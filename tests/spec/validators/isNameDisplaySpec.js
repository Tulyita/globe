'use strict';

var mongoose = require('mongoose');
var isNameDisplay = require('../../../server/validators/isNameDisplay');

describe('isNameDisplay', function() {

	it('should accept a valid nameDisplay', function() {
		var nameDisplay = {
			_id: mongoose.Types.ObjectId(),
			name: 'Bob',
			site: 'j',
			group: 'u'
		};

		expect(isNameDisplay(nameDisplay)).toBe(true);
	});


	it('should reject if a field is missing', function() {
		var nameDisplay = {
			_id: mongoose.Types.ObjectId(),
			name: 'Bob',
			group: 'u'
		};

		expect(isNameDisplay(nameDisplay)).toBe(false);
	});


	it('should reject extra fields', function() {
		var nameDisplay = {
			_id: mongoose.Types.ObjectId(),
			name: 'Bob',
			site: 'j',
			group: 'u',
			extra: 'hue'
		};

		expect(isNameDisplay(nameDisplay)).toBe(false);
	});
});