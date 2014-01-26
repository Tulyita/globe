'use strict';

var Guild = require('../../models/guild');

module.exports = function(schema) {

	schema.statics.incGp = function(guildId, userId, ammount, callback) {

		this.update(
		 {_id: guildId, 'members._id': userId},
		 {$inc: {
			 gp: ammount,
			 gpDay: ammount,
			 gpWeek: ammount,
			 gpLife: ammount,
			 'members.$.gp': ammount,
			 'members.$.gpDay': ammount,
			 'members.$.gpWeek': ammount,
			 'members.$.gpLife': ammount
		 }},
		 callback
		);

	};
};