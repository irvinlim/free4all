import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayCommentsCard } from '../../components/giveaways/giveaway-comments-card';
import { Loading } from '../../components/loading';

const composer = (props, onData) => {
  onData(null, {
    user: Meteor.user(),
    gaId: props.gaId
  });
};

export default composeWithTracker(composer, Loading)(GiveawayCommentsCard);
