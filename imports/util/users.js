import { Meteor } from 'meteor/meteor';
import { propExistsDeep } from './helper';
import * as AvatarHelper from './avatar';

const maybeGetUser = (userOrId) => {
  if (!userOrId)
    return null;
  if (userOrId._id)
    return userOrId;
  else
    return Meteor.users.findOne(userOrId);
};

export const getFirstInitial = (user) => {
  user = maybeGetUser(user);
  return propExistsDeep(user, ['profile', 'name', 'first']) ? user.profile.name.first.charAt(0) : null;
};

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

const resolveFacebookAvatarSize = (size) => {
  if (size <= 50)
    return "small";
  else if (size <= 100)
    return "normal";
  else
    return "large";
}

export const getAvatarUrl = (user, size=64) => {
  user = maybeGetUser(user);

  if (!user)
    return "";

  // Using native Cloudinary
  if (propExistsDeep(user, ['profile', 'avatarId']))
    return AvatarHelper.getUrl(user.profile.avatarId, size);
  // Using Facebook Graph
  else if (propExistsDeep(user, ['services', 'facebook', 'id']))
    return "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=" + resolveFacebookAvatarSize(size);
  // Using Google+ profile picture (provided on first login)
  else if (propExistsDeep(user, ['services', 'google', 'picture']))
    return user.services.google.picture;
  // Using Gravatar
  else if (user.emails && user.emails.length)
    return Gravatar.imageUrl(user.emails[0].address, { size: size, default: 'mm', secure: true });
  else
    return null;
}
