import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { HeaderNotifications } from '../../components/header/header-notifications';
import { Loading } from '../../components/loading';

const composer = (props, onData) => {
  if (Meteor.subscribe('notifications').ready()) {
    onData(null, {
      notifications: Herald.getNotifications({ user: Meteor.userId(), medium: 'onsite' }, { sort: { timestamp: -1 }, limit: 10 }).fetch(),
      notificationCount: Herald.getNotifications({ user: Meteor.userId(), medium: 'onsite' }).count(),
    });
  }
};

export default composeWithTracker(composer, Loading)(HeaderNotifications);
