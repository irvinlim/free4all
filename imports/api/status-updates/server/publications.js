import { Meteor } from 'meteor/meteor';
import { StatusUpdates } from '../status-updates';

Meteor.publish('status-updates-for-giveaway', gaId => StatusUpdates.find({ giveawayId: gaId }));
