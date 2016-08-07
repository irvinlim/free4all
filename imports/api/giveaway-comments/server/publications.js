import { Meteor } from 'meteor/meteor';
import { Giveaways } from '../../giveaways/giveaways';
import { GiveawayComments } from '../giveaway-comments';

import * as RolesHelper from '../../../util/roles';

Meteor.publish('comments-for-giveaway', function(gaId) {
  check(gaId, Match._id);

  const ga = Giveaways.findOne(gaId);

  // Don't publish comments for removed giveaways
  if (ga && ga.isRemoved)
    return this.ready();

  const selector = {
    giveawayId: gaId,
    isRemoved: { $ne: true },
  };

  // Can show removed comments if you are a mod or admin
  if (RolesHelper.modsOrAdmins(this.userId))
    delete selector.isRemoved;

  // Publish all comments for this giveaway that are not removed.
  return GiveawayComments.find(selector);
});
