import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayComments as GiveawayCommentsComponent } from '../../components/giveaways/giveaway-comments';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';
import { GiveawayComments } from '../../../api/giveaway-comments/giveaway-comments';

import * as RolesHelper from '../../../util/roles';
import * as GiveawaysHelper from '../../../util/giveaways';

const composer = ({ gaId, showRemoved, showActions }, onData) => {
  if (!gaId)
    return;

  if (Meteor.subscribe('comments-for-giveaway', gaId).ready()) {
    const ga = Giveaways.findOne(gaId);

    // Query selector
    const selector = {
      giveawayId: gaId,
      isRemoved: { $ne: true }
    };

    // Can show removed comments if you are a mod or admin
    // Check prop for showRemoved
    if (RolesHelper.modsOrAdmins(Meteor.user()) && showRemoved)
      delete selector.isRemoved;

    // Get sorted comments
    const sortedComments = GiveawayComments.find(selector, { sort: { createdAt: -1 } });

    const users = [];
    sortedComments.forEach(comment => {
      if (users.indexOf(comment.userId) < 0) users.push(comment.userId);
    });

    if (Meteor.subscribe('users-by-id', users).ready()) {
      const denormalizedComments = sortedComments.map(comment => {
        return {
          ...comment,
          user: Meteor.users.findOne(comment.userId),
        };
      });

      onData(null, {
        ga: ga,
        comments: denormalizedComments,
        owner: Meteor.users.findOne(ga.userId),
        showActions: showActions,
      });
    }
  }
};

export default composeWithTracker(composer, Loading)(GiveawayCommentsComponent);
