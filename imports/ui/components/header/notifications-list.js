import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import * as Colors from 'material-ui/styles/colors';

import * as Helper from '../../../util/helper';
import * as NotificationsHelper from '../../../util/notifications';

const makeNotificationList = ({ notifications, handleNotificationTouchTap }) => {
  if (!notifications || !notifications.length)
    return (
      <ListItem
        disabled={true}
        primaryText={
          <span style={{ fontSize: "12px", color: Colors.grey700, textAlign: 'center' }}>No new notifications.</span>
        } />
    );

  const listItems = notifications.map(item => {
    const notif = item.message();

    return (
      <ListItem
        key={ item._id }
        primaryText={
          <span style={{ fontSize: "14px", fontWeight: 500, color: Colors.grey700 }}>{ notif.title }</span>
        }
        secondaryText={
          <p style={{ height: 54 }}>
            <span className="notification-body" style={{ fontSize: "12px", height: 36, display: 'block', overflow: 'hidden' }}>{ notif.body }</span>
            <span className="timestamp" style={{ display:'block', textAlign:'right', fontSize:10, marginTop: 2 }}>{ moment(notif.timestamp).fromNow() }</span>
          </p>
        }
        secondaryTextLines={2}
        leftAvatar={ NotificationsHelper.makeNotifAvatar(notif.avatar) }
        onTouchTap={ handleNotificationTouchTap(item._id, notif.url) }
      />
    );
  });

  return Helper.insertDividers(listItems);
};

export default NotificationsList = (props) => (
  <List>
    { makeNotificationList(props) }
  </List>
);
