import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { HeaderProfile } from '../../components/header/header-profile';
import { Loading } from '../../components/loading';

const composer = (props, onData) => {
  onData(null, {
    user: Meteor.user(),
  });
};

export default composeWithTracker(composer, Loading)(HeaderProfile);
