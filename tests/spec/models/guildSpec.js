'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var _ = require('lodash');
var Guild = require('../../../server/models/guild');
var User = require('../../../server/models/user');

describe('guild', function() {

	beforeEach(function() {
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('schema', function() {

		it('should accept valid values', function(done) {

			var obj = {};
			obj._id = 'birds';
			obj.join = Guild.INVITE;
			obj.createdDate = new Date(1);
			obj.activeDate = new Date(1);
			obj.hasBanner = true;
			obj.gp = 3;
			obj.gpDay = 3;
			obj.gpWeek = 3;
			obj.gpLife = 3;
			obj.owners = [];
			obj.members = [];
			obj.joinRequests = [];
			obj.invitations = [];

			Guild.create(obj, function(err, guild) {
				expect(err).toBeFalsy();

				expect(guild._id).toBe('birds');
				expect(guild.join).toBe(Guild.INVITE);
				expect(guild.createdDate).toEqual(new Date(1));
				expect(guild.activeDate).toEqual(new Date(1));
				expect(guild.hasBanner).toEqual(true);
				expect(guild.gp).toBe(3);
				expect(guild.gpDay).toBe(3);
				expect(guild.gpWeek).toBe(3);
				expect(guild.gpLife).toBe(3);
				expect(guild.owners.toObject()).toEqual([]);
				expect(guild.members.toObject()).toEqual([]);
				expect(guild.joinRequests.toObject()).toEqual([]);
				expect(guild.invitations.toObject()).toEqual([]);

				done();
			});
		});

		it('should return an error if a required field is invalid', function() {
			var obj = {
				_id: ''
			};
			Guild.create(obj, function(err) {
				expect(err).toMatch('Validator failed');
				expect(err).toMatch('_id');
			});
		});

		it('should replace non-required but invalid fields with a default', function(done) {
			var obj = {};
			obj._id = 'turtles';
			obj.join = {haxxor: true};
			obj.createdDate = {haxxor: true};
			obj.activeDate = {haxxor: true};
			obj.hasBanner = {haxxor: true};
			obj.gp = {haxxor: true};
			obj.gpDay = {haxxor: true};
			obj.gpWeek = {haxxor: true};
			obj.gpLife = {haxxor: true};
			obj.owners = {haxxor: true};
			obj.members = {haxxor: true};
			obj.joinRequests = {haxxor: true};
			obj.invitations = {haxxor: true};

			Guild.create(obj, function(err, guild) {

				expect(guild.join).toBe(Guild.INVITE);
				expect(_.isDate(guild.createdDate)).toBe(true);
				expect(_.isDate(guild.activeDate)).toBe(true);
				expect(guild.hasBanner).toBe(false);
				expect(guild.gp).toBe(0);
				expect(guild.gpDay).toBe(0);
				expect(guild.gpWeek).toBe(0);
				expect(guild.gpLife).toBe(0);
				expect(guild.owners.toObject()).toEqual([]);
				expect(guild.members.toObject()).toEqual([]);
				expect(guild.joinRequests.toObject()).toEqual([]);
				expect(guild.invitations.toObject()).toEqual([]);

				done(err);
			});
		});
	});
});