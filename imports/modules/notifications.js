import React from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';

import * as Helper from './helper';

export const makeNotifAvatar = (avatar) => {
  const defaultAvatar = <Avatar icon={ <FontIcon className="material-icons">priority_high</FontIcon> } />

  if (!avatar || !avatar.type || !avatar.val)
    return defaultAvatar;

  switch (avatar.type) {
    case "giveaway":
      const ga = Giveaways.findOne(avatar.val);
      return ga.avatar && ga.avatar.url ?
        <Avatar src={ ga.avatar.url } /> :
        defaultAvatar;
    case "user":
      const user = Meteor.users.findOne(avatar.val);
      return user.avatar && user.avatar.url ?
        <Avatar src={ user.avatar.url } /> :
        defaultAvatar;
    case "announcement":
      return <Avatar icon={ <FontIcon className="material-icons">star_rate</FontIcon> } />;
    case "url":
      return <Avatar src={ avatar.val } />;
    default:
      return defaultAvatar;
  }
};
