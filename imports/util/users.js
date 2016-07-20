import { Meteor } from 'meteor/meteor';
import React from 'react';
import Avatar from 'material-ui/Avatar';

import * as Colors from 'material-ui/styles/colors';
import { propExistsDeep } from './helper';
import * as AvatarHelper from './avatar';
import * as IconsHelper from './icons';

const maybeGetUser = (userOrId) => {
  if (!userOrId)
    return null;
  if (userOrId._id)
    return userOrId;
  else
    return Meteor.users.findOne(userOrId);
};

// Name


export const getFullName = (user) => {
  user = maybeGetUser(user);

  const firstName = propExistsDeep(user, ['profile', 'firstName']) ? user.profile.firstName : null;
  const lastName = propExistsDeep(user, ['profile', 'lastName']) ? user.profile.lastName : null;

  if (firstName && lastName)
    return firstName + " " + lastName;
  else if (firstName)
    return firstName;
  else
    return "Someone";
};

export const getFullNameWithLabelIfEqual = (user, user2, label) => {
  user = maybeGetUser(user);
  user2 = maybeGetUser(user2);
  const fullName = getFullName(user);

  if (user && user2 && user._id == user2._id)
    return <span>{ fullName } <span className="user-label">({ label })</span></span>
  else
    return <span>{ fullName }</span>;
};

export const getFirstInitial = (user) => {
  user = maybeGetUser(user);
  return propExistsDeep(user, ['profile', 'firstName']) ? user.profile.firstName.charAt(0) : null;
};

// Profile
export const resolveGender = (gender) => {
  switch (gender.toLowerCase()) {
    case "male":
      return "Male";
    case "female":
      return "Female";
    default:
      return "Unspecified";
  }
};

// Avatar
const resolveFacebookAvatarSize = (size) => {
  if (size <= 50)
    return "small";
  else if (size <= 100)
    return "normal";
  else
    return "large";
};

export const getAvatarUrl = (user, size=64) => {
  user = maybeGetUser(user);

  if (!user)
    return "";

  // Using native Cloudinary
  if (propExistsDeep(user, ['profile', 'avatarId']))
    return AvatarHelper.getUrl(user.profile.avatarId, size);
  // Using Facebook Graph
  else if (propExistsDeep(user, ['services', 'facebook', 'id']))
    return "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=" + resolveFacebookAvatarSize(size);
  // Using Google+ profile picture (provided on first login)
  else if (propExistsDeep(user, ['services', 'google', 'picture']))
    return user.services.google.picture;
  // Using Gravatar
  else if (user.emails && user.emails.length)
    return Gravatar.imageUrl(user.emails[0].address, { size: size, default: 'mm', secure: true });
  else
    return null;
};

export const getAvatar = (user, size=64, style) => {
  const avatarUrl = getAvatarUrl(user, size);
  const firstInitial = getFirstInitial(user);

  if (avatarUrl)
    return <Avatar src={ avatarUrl } size={size} style={style} />;
  else if (firstInitial)
    return <Avatar backgroundColor="#097381" style={style}>{ firstInitial }</Avatar>;
  else
    return IconsHelper.materialIcon("person", _.extend({ color: Colors.grey50 }, style));
};
