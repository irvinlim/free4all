import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { Profile } from '../../components/profile/profile';
import { Loading } from '../../components/loading';

const composer = (props, onData) => {
  if (!props.userId)
    return;

  if (Meteor.subscribe('user-by-id', props.userId).ready()) {
    const user = Meteor.users.findOne(props.userId);
    onData(null, { user });
  }
};

export default composeWithTracker(composer, Loading)(Profile);
