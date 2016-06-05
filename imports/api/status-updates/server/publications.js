import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { StatusUpdates } from '../status-updates';

Meteor.publish('status-updates-for-giveaway', gaId => {
  check(gaId, Match._id);
  return StatusUpdates.find({ giveawayId: gaId });
});
