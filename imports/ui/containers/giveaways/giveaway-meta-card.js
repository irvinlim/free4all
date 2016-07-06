import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayMetaCard } from '../../components/giveaways/giveaway-meta-card';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';

const composer = (props, onData) => {
  if (Meteor.subscribe('giveaway-by-id', props.gaId).ready()) {
    const ga = Giveaways.findOne(props.gaId);

    if (Meteor.subscribe('user-by-id', ga.userId).ready()) {
      const user = Meteor.users.findOne({ _id: ga.userId });

      if (Meteor.subscribe('giveaways-by-user', ga.userId).ready()) {
        const shareCount = Giveaways.find({ userId: ga.userId }).count();

        onData(null, { ga, user, shareCount });
      }
    }
  }
};

export default composeWithTracker(composer, Loading)(GiveawayMetaCard);
