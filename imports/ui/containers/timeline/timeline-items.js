import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { TimelineItems } from '../../components/timeline/timeline-items';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';

const composer = (props, onData) => {
  if (Meteor.subscribe('giveaways-search', props).ready()) {
    onData(null, {
      giveaways: Giveaways.find({}, {
        sort: { startDateTime: -1 },
        skip: props.offset,
        limit: props.perPage,
      }),
      props: props,
    });
  }
};

export default composeWithTracker(composer, Loading)(TimelineItems);
