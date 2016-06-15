import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import * as Colors from 'material-ui/styles/colors';

import * as Helper from '../../../modules/helper';
import * as NotificationsHelper from '../../../modules/notifications';

const makeNotificationList = ({ notifications, handleNotificationTouchTap }) => {
  if (!notifications || !notifications.length)
    return (
      <ListItem disabled={true} primaryText="No new notifications." />
    );

  const listItems = notifications.map(item => {
    const notif = item.message();

    return (
      <ListItem
        key={ item._id }
        primaryText={
          <span style={{ color: Colors.grey700 }}>{ notif.title }</span>
        }
        secondaryText={
          <p>
            <span className="notification-body" style={{ height:18, display:'block' }}>{ notif.body }</span>
            <span className="timestamp" style={{ display:'block', textAlign:'right', fontSize:10, marginTop:2 }}>{ moment(notif.timestamp).fromNow() }</span>
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
