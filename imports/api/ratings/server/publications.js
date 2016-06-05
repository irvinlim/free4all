import { Meteor } from 'meteor/meteor';
import { Ratings } from '../ratings';

// Cannot aggregate, just publish in entirety for each giveaway
Meteor.publish('ratings-for', giveawayId => {
  check(giveawayId, Match._id);
  return Ratings.find({ giveawayId: giveawayId });
});
