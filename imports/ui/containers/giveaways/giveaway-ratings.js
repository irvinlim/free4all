import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayRatings } from '../../components/giveaways/giveaway-ratings';
import { Loading } from '../../components/loading';
import { Giveaways } from '../../../api/giveaways/giveaways';

const composer = (props, onData) => {
  if (!props.gaId)
    return;

  if (Meteor.subscribe('giveaway-by-id', props.gaId).ready()) {
    const giveaway = Giveaways.findOne(props.gaId);

    if (!giveaway)
      return;

    const findOwnVotes = giveaway.ratings ? giveaway.ratings.filter(rating => Meteor.userId() == rating.userId) : [];
    const numUpvotes = giveaway.ratings ? giveaway.ratings.reduce((sum, rating) => rating.isUpvote ? sum + 1 : sum, 0) : 0;
    const numDownvotes = giveaway.ratings ? giveaway.ratings.length - numUpvotes : 0;

    onData(null, {
      gaId: props.gaId,
      upvotes: numUpvotes,
      downvotes: numDownvotes,
      ownVote: findOwnVotes.length ? findOwnVotes[0].isUpvote : null,
    });
  }
};

export default composeWithTracker(composer, Loading)(GiveawayRatings);
