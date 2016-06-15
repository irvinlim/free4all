import { Meteor } from 'meteor/meteor';
import { Giveaways } from '../giveaways';

Meteor.publish('giveaway-by-id', function(gaId) {
  check(gaId, Match._id);
  return Giveaways.find(gaId);
});

Meteor.publish('giveaways-on-screen', function(date, mapBounds) {
  check(date, Date);
  check(mapBounds, Array);

  const tomorrow = moment(date).add(1, 'd').toDate();
  const findParams = {
    coordinates : {
      $geoWithin : { $box : mapBounds }
    },
    startDateTime:  { $lte: tomorrow, },    // Must be ongoing/starting in the next 24 hours
    endDateTime:    { $gt:  date, },        // Must not be over
    deleted:        { $ne:  true },         // Must not be deleted (local deletion)
  };

  return Giveaways.find(findParams);
});
