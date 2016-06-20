import { Meteor } from 'meteor/meteor';

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
  return user.profile.name.first.charAt(0);
}
