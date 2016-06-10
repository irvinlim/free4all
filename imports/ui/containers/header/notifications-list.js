import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { NotificationsList } from '../../components/header/notifications-list';
import { Loading } from '../../components/loading';

const composer = (props, onData) => {
  if (Meteor.subscribe('notifications').ready()) {
    onData(null, {
      notifications: Herald.getNotifications({ user: Meteor.userId(), medium: 'onsite' }).fetch(),
      handleNotificationTouchTap: props.handleNotificationTouchTap,
    });
  }
};

export default composeWithTracker(composer, Loading)(NotificationsList);
