import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayRatings } from '../../components/giveaways/giveaway-ratings';
import { Loading } from '../../components/loading';

import { Ratings } from '../../../api/ratings/ratings';

const composer = (props, onData) => {
  if (!props.gaId)
    return;

  if (Meteor.subscribe('ratings-for', props.gaId).ready()) {
    const findOwnVote = Ratings.findOne({ giveawayId: props.gaId, userId: Meteor.userId() });

    onData(null, {
      gaId: props.gaId,
      upvotes: Ratings.find({ giveawayId: props.gaId, isUpvote: true }).count(),
      downvotes: Ratings.find({ giveawayId: props.gaId, isUpvote: false }).count(),
      ownVote: findOwnVote ? findOwnVote.isUpvote : null,
    });
  }
};

export default composeWithTracker(composer, Loading)(GiveawayRatings);
