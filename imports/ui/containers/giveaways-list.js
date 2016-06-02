import { composeWithTracker } from 'react-komposer';
import { Giveaways } from '../../api/giveaways/giveaways.js';
import { GiveawaysList } from '../components/giveaways-list.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('giveaways');
  if (subscription.ready()) {
    const giveaways = Giveaways.find().fetch();
    onData(null, { giveaways });
  }
};

export default composeWithTracker(composer, Loading)(GiveawaysList);
