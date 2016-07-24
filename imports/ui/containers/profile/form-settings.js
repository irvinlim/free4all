import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { FormSettings } from '../../components/profile/form-settings';
import { Loading } from '../../components/loading';

const composer = (props, onData) => {
  if (Meteor.subscribe('user-data').ready()) {
    onData(null, {
      user: Meteor.user()
    });
  }
};

export default composeWithTracker(composer, Loading)(FormSettings);
