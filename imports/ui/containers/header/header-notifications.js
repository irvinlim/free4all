import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { HeaderNotifications } from '../../components/header/header-notifications';
import { LoadingWithProps } from '../../components/loading';

const composer = (props, onData) => {
  if (!Meteor.userId()) {
    onData(null, {});
  } else if (Meteor.subscribe('notifications').ready()) {
    onData(null, {
      notifications: Herald.getNotifications({ user: Meteor.userId(), medium: 'onsite' }, { sort: { timestamp: -1 }, limit: 10 }).fetch(),
      notificationCount: Herald.getNotifications({ user: Meteor.userId(), medium: 'onsite' }).count(),
    });
  }
};

export default composeWithTracker(composer, LoadingWithProps({ size: 0.5, color: "#ced5e3", containerClassName: "loading-float" }))(HeaderNotifications);
