import { Meteor } from 'meteor/meteor';

import { Giveaways } from '../giveaways';

Meteor.publish('giveaways-current-upcoming', function(date) {
  check(date, Date);
  const tomorrow = moment(date).add(1, 'd').toDate();

  return Giveaways.find({
    startDateTime:  { $lte: tomorrow, },    // Must be ongoing/starting in the next 24 hours
    endDateTime:    { $gt:  date, },        // Must not be over
    deleted:        { $ne:  true },         // Must not be deleted (local deletion)
  });
});

Meteor.publish('giveaway-by-id', function(gaId) {
  check(gaId, Match._id);
  return Giveaways.find(gaId);
});

Meteor.publish('giveaway-on-screen', function(bottomLeft, topRight) {
  if (!bottomLeft && !topRight) {
    return [];
  }
  return Giveaways.find({
    coordinates : {
      $geoWithin : { $box : [bottomLeft, topRight]}
    }
  })
});
