import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayRatings } from '../../components/giveaways/giveaway-ratings';
import { Loading } from '../../components/loading';

import { Ratings } from '../../../api/ratings/ratings';

const composer = (props, onData) => {
  if (Meteor.subscribe('ratings-for', props.ga._id).ready()) {
    const findOwnVote = Ratings.findOne({ giveawayId: props.ga._id, userId: Meteor.userId() });

    onData(null, {
      ga: props.ga,
      upvotes: Ratings.find({ giveawayId: props.ga._id, isUpvote: true }).count(),
      downvotes: Ratings.find({ giveawayId: props.ga._id, isUpvote: false }).count(),
      ownVote: findOwnVote ? findOwnVote.isUpvote : null,
    });
  }
};

export default composeWithTracker(composer, Loading)(GiveawayRatings);
