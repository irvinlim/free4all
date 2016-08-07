import React from 'react';
import Avatar from 'material-ui/Avatar';

import { Giveaways } from '../api/giveaways/giveaways';

import * as IconsHelper from './icons';
import * as AvatarHelper from './avatar';
import * as UsersHelper from './users';
import * as GiveawaysHelper from './giveaways';
import { pluralizer } from './helper';
import { getFullName } from './users';

export const makeNotifAvatar = (avatar) => {
  const defaultAvatar = <Avatar icon={ IconsHelper.icon("priority_high") } />

  if (!avatar || !avatar.type || !avatar.val)
    return defaultAvatar;

  switch (avatar.type) {
    case "giveaway":
      const ga = Giveaways.findOne(avatar.val);
      return GiveawaysHelper.makeAvatar(ga, 40);
    case "user":
      return UsersHelper.getAvatar(avatar.val, 40);
    case "announcement":
      return <Avatar icon={ IconsHelper.icon("star_rate") } />;
    case "url":
      return <Avatar src={ avatar.val } />;
    case "icon":
      return AvatarHelper.makeAvatarIcon(IconsHelper.icon(avatar.val.icon), avatar.val.color, 40);
    default:
      return defaultAvatar;
  }
};

export const aggregateUserNames = (userIds) => {
  if (userIds.length === 0)
    return "No one";

  const userNames = userIds.map(getFullName);

  if (userIds.length === 1)
    return userNames[0];
  else if (userIds.length === 2)
    return `${userNames[0]} and ${userNames[1]}`;
  else
    return `${userNames[0]} and ${userIds.length - 1} ${pluralizer(userIds.length - 1, 'other', 'others')}`;
};
