import { Meteor } from 'meteor/meteor';
import React from 'react';
import Avatar from 'material-ui/Avatar';
import { Link } from 'react-router';

import * as Colors from 'material-ui/styles/colors';
import { nl2br, propExistsDeep } from './helper';
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

export const getUserLink = (user, content=null, style={}) => {
  user = maybeGetUser(user);

  if (!user)
    return getFullName(user);

  if (!content)
    content = getFullName(user);

  return (
    <Link to={`/profile/${user._id}`} style={ style }>
      { content }
    </Link>
  );
};

export const getFullName = (user) => {
  user = maybeGetUser(user);
  return propExistsDeep(user, ['profile', 'name']) ? user.profile.name : "Someone";
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
  return propExistsDeep(user, ['profile', 'name']) ? user.profile.name.charAt(0) : null;
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

export const getBio = (user) => {
  if (propExistsDeep(user, ['profile', 'bio']))
    return nl2br(user.profile.bio);
  else
    return null;
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
    return `https://graph.facebook.com/${user.services.facebook.id}/picture/?width=${size*2}&height=${size*2}`;
  // Using Google+ profile picture (provided on first login)
  else if (propExistsDeep(user, ['services', 'google', 'picture']))
    return user.services.google.picture;
  // Using Gravatar
  else if (user.emails && user.emails.length)
    return Gravatar.imageUrl(user.emails[0].address, { size: size*2, default: 'mm', secure: true });
  else
    return null;
};

export const getAvatar = (user, size=64, style) => {
  const avatarUrl = getAvatarUrl(user, size);
  const firstInitial = getFirstInitial(user);

  if (avatarUrl)
    return <Avatar src={ avatarUrl } size={size} style={style} />;
  else if (firstInitial)
    return <Avatar backgroundColor="#097381" size={size} style={style}>{ firstInitial }</Avatar>;
  else
    return IconsHelper.materialIcon("person", _.extend({ color: Colors.grey50 }, style));
};

// Authentication
const hasService = (service) => (user) => propExistsDeep(user, ['services', service]);
export const hasPasswordService = hasService('password');
export const hasFacebookService = hasService('facebook');
export const hasGoogleService = hasService('google');
export const hasIVLEService = hasService('ivle');
export const countServices = (user) => user ? Object.keys(user.services).filter(service => service != "resume").length : 0;

// Admin-only methods
export const adminGetFirstEmail = (user) => propExistsDeep(user, ['emails', 0, 'address']) ? user.emails[0].address : null;
export const adminGetRegisteredDate = (user) => user && user.createdAt ? moment(user.createdAt).format('Do MMM YYYY') : null;
export const adminGetLastLoginDate = (user) => {
  if (propExistsDeep(user, ['services', 'resume', 'loginTokens']) && user.services.resume.loginTokens.length)
    return moment(user.services.resume.loginTokens.reduce((p, x) => !p || x.when && moment(x.when).isAfter(p) ? x.when : p)).fromNow();
  else
    return "Never";
};
