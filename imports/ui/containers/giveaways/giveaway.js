import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { Giveaway } from '../../components/giveaways/giveaway';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';

const composer = (props, onData) => {
  if (Meteor.subscribe('giveaway-by-id', props.gaId).ready()) {
    onData(null, {
      ga: Giveaways.findOne(props.gaId),
    });
  }
};

export default composeWithTracker(composer, Loading)(Giveaway);
