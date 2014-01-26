'use strict';

//require('../../../../server/config/env.js');
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGO_URI);

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Guild = require('../../../../server/models/guild');


describe('guild/gp', function() {


	//////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////

	// does work, but not with mockgoose
	/*describe('incGp', function() {

		var userId, guildId;

		beforeEach(function(done) {
			userId = mongoose.Types.ObjectId();
			guildId = Math.random() + '';
			Guild.create({
				_id: guildId,
				members: [{
					_id: userId,
					name: 'Shallot',
					site: 'j',
					group: 'u'
				}]
			}, function(err) {
				done(err);
			});
		});

		afterEach(function() {
			mockgoose.reset();
		});

		it('should inc guild level gp counters', function(done) {
			Guild.incGp(guildId, userId, 5, function(err, modifiedDocs) {
				expect(err).toBeFalsy();
				expect(modifiedDocs).toBe(1);

				Guild.findById(guildId, function(err, guild) {
					expect(guild.gp).toBe(5);
					expect(guild.gpDay).toBe(5);
					expect(guild.gpWeek).toBe(5);
					expect(guild.gpLife).toBe(5);
					done(err);
				});
			});
		});

		it('should inc user level gp counters', function(done) {
			Guild.incGp(guildId, userId, 5, function(err, modifiedDocs) {
				expect(err).toBeFalsy();
				expect(modifiedDocs).toBe(1);

				Guild.findById(guildId, function(err, guild) {
					expect(guild.members[0].gpDay).toBe(5);
					expect(guild.members[0].gpWeek).toBe(5);
					expect(guild.members[0].gpLife).toBe(5);
					done(err);
				});
			});
		});
	});*/
});