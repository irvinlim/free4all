import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Communities } from '../communities/communities';
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
        Meteor.users.update( { _id: user._id }, { $set: { 'profile.gender': UsersHelper.resolveGender(user.services.google.gender) } });
  },
});

export const updateProfileIVLE = new ValidatedMethod({
  name: 'users.updateProfileIVLE',
  validate: new SimpleSchema({
    userId: { type: String }
  }).validator(),
  run({ userId }) {
    const user = Meteor.users.findOne(userId);

    if (!user)
      return;

    if (!propExistsDeep(user, ['profile', 'firstName']))
      if (propExistsDeep(user, ['services', 'ivle', 'name']))
        Meteor.users.update( { _id: user._id }, { $set: { 'profile.firstName': user.services.ivle.name } });
  },
});

export const joinCommunity = new ValidatedMethod({
  name: 'users.joinCommunity',
  validate: new SimpleSchema({
    commId:{ type: String },
    userId:{ type: String }
  }).validator(),
  run({ commId, userId }){
    const user = Meteor.users.findOne(userId);

    if (!user)
      return;

    if(!user.communityIds || user.communityIds.indexOf(commId) === -1){
      Meteor.users.update( { _id: user._id }, { $push: { 'communityIds': commId } });
      Communities.update( { _id: commId }, {$inc: {'count': 1}})
    }
  }
});

export const leaveCommunity = new ValidatedMethod({
  name: 'users.leaveCommunity',
  validate: new SimpleSchema({
    commId:{ type: String },
    userId:{ type: String }
  }).validator(),
  run({ commId, userId }){
    const user = Meteor.users.findOne(userId);

    if (!user)
      return;

    if(!user.communityIds || user.communityIds.indexOf(commId) > -1){
      Meteor.users.update( { _id: user._id }, { $pull: { 'communityIds': commId } });
      Communities.update( { _id: commId }, {$inc: {'count': -1}})
    } 
  }
});

export const setHomeCommunity = new ValidatedMethod({
  name: 'users.setHomeCommunity',
  validate: new SimpleSchema({
    community:{ type: Object, blackbox: true},
    userId:{ type: String },
  }).validator(),
  run({ community, userId }){
    const user = Meteor.users.findOne(userId);

    if (!user)
      return;

    Meteor.users.update({ _id: user._id }, {$set: {
      'homeLocation': community.coordinates,
      'homeCommunityId': community._id
    }});
  }
});
