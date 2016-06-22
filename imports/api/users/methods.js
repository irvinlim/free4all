import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { propExistsDeep } from '../../util/helper';
import * as UsersHelper from '../../util/users';

export const updateProfileFacebook = new ValidatedMethod({
  name: 'users.updateProfileFacebook',
  validate: new SimpleSchema({
    userId: { type: String }
  }).validator(),
  run({ userId }) {
    const user = Meteor.users.findOne(userId);

    if (!user)
      return;

    if (!propExistsDeep(user, ['profile', 'firstName']))
      if (propExistsDeep(user, ['services', 'facebook', 'first_name']))
        Meteor.users.update( { _id: user._id }, { $set: { 'profile.firstName': user.services.facebook.first_name } });

    if (!propExistsDeep(user, ['profile', 'lastName']))
      if (propExistsDeep(user, ['services', 'facebook', 'last_name']))
        Meteor.users.update( { _id: user._id }, { $set: { 'profile.lastName': user.services.facebook.last_name } });

    if (!propExistsDeep(user, ['profile', 'gender']))
      if (propExistsDeep(user, ['services', 'facebook', 'gender']))
        Meteor.users.update( { _id: user._id }, { $set: { 'profile.gender': UsersHelper.resolveGender(user.services.facebook.gender) } });
  },
});

export const updateProfileGoogle = new ValidatedMethod({
  name: 'users.updateProfileGoogle',
  validate: new SimpleSchema({
    userId: { type: String }
  }).validator(),
  run({ userId }) {
    const user = Meteor.users.findOne(userId);

    if (!user)
      return;

    if (!propExistsDeep(user, ['profile', 'firstName']))
      if (propExistsDeep(user, ['services', 'google', 'given_name']))
        Meteor.users.update( { _id: user._id }, { $set: { 'profile.firstName': user.services.google.given_name } });

    if (!propExistsDeep(user, ['profile', 'lastName']))
      if (propExistsDeep(user, ['services', 'google', 'family_name']))
        Meteor.users.update( { _id: user._id }, { $set: { 'profile.lastName': user.services.google.family_name } });

    if (!propExistsDeep(user, ['profile', 'gender']))
      if (propExistsDeep(user, ['services', 'google', 'gender']))
        Meteor.users.update( { _id: user._id }, { $set: { 'profile.gender': user.services.google.gender } });
  },
});
