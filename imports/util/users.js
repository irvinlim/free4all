import { Meteor } from 'meteor/meteor';
import * as Helper from './helper';

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
  return Helper.propExistsDeep(user, ['profile', 'name', 'first']) ? user.profile.name.first.charAt(0) : null;
}
