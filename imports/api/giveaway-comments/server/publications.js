import { Meteor } from 'meteor/meteor';
import { Giveaways } from '../../giveaways/giveaways';
import { GiveawayComments } from '../giveaway-comments';

Meteor.publish('comments-for-giveaway', function(gaId) {
  check(gaId, Match._id);

  const ga = Giveaways.findOne(gaId);

  // Don't publish comments for removed giveaways
  if (ga.isRemoved)
    return this.ready();

  // Publish all comments for this giveaway that are not removed.
  return GiveawayComments.find({
    giveawayId: gaId,
    isRemoved: { $ne: true },
  });
});
