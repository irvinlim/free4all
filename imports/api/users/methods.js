import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Accounts } from 'meteor/accounts-base';
import { Facebook } from 'meteor/facebook';
import { Google } from 'meteor/google';
import { IVLE } from 'meteor/irvinlim:ivle';

import { Communities } from '../communities/communities';
import { arrayContainsObjectMatch, propExistsDeep } from '../../util/helper';
import { UsersSchema } from './users';

import { capitalizeFirstLetter, arrayContains } from '../../util/helper';
import * as UsersHelper from '../../util/users';
import * as RolesHelper from '../../util/roles';

// Profile settings
export const updateProfileSettings = new ValidatedMethod({
  name: 'user.updateProfileSettings',
  validate: new SimpleSchema({
    _id: { type: String },
    name: { type: String },
    gender: { type: String },
    birthday: { type: Date },
    bio: { type: String, optional: true },
    website: { type: String, optional: true },
    facebookId: { type: String, optional: true },
    twitterId: { type: String, optional: true },
    instagramId: { type: String, optional: true },
    googlePlusId: { type: String, optional: true },
    avatarId: { type: String, optional: true },
  }).validator(),
  run({ _id, name, gender, birthday, bio, website, facebookId, twitterId, instagramId, googlePlusId, avatarId }) {
    const user = Meteor.users.findOne(_id);

    if (!user)
      throw new Meteor.Error("users.updateProfileSettings.undefinedUser", "No such user.");
    else if (!this.userId)
      throw new Meteor.Error("users.updateProfileSettings.notAuthenticated", "Need to be logged in to edit user profile.");
    else if (!RolesHelper.ownerOrModsOrAdmins(this.userId, user._id))
      throw new Meteor.Error("users.updateProfileSettings.notAuthorized", "Not authorized to edit user profile.");

    // Update fields
    Meteor.users.update(_id, {
      $set: {
        'profile.name': name,
        'profile.gender': gender,
        'profile.birthday': birthday,
        'profile.bio': bio,
        'profile.website': website,
        'profile.facebookId': facebookId,
        'profile.twitterId': twitterId,
        'profile.instagramId': instagramId,
        'profile.googlePlusId': googlePlusId,
      }
    });

    // Update avatar only if set
    if (avatarId)
      Meteor.users.update(_id, { $set: { 'profile.avatarId': avatarId } });
  }
});

export const resetAvatar = new ValidatedMethod({
  name: 'user.resetAvatar',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    const user = Meteor.users.findOne(_id);

    if (!user)
      throw new Meteor.Error("users.resetAvatar.undefinedUser", "No such user.");
    else if (!RolesHelper.ownerOrModsOrAdmins(this.userId, user._id))
      throw new Meteor.Error("users.resetAvatar.notAuthorized", "Not authorized to reset avatar.");

    return Meteor.users.update(_id, { $unset: { 'profile.avatarId': true } });
  }
});

// Intended for admins only
export const setPassword = new ValidatedMethod({
  name: 'user.setPassword',
  validate: new SimpleSchema({
    userId: { type: String },
    newpassword: { type: String },
  }).validator(),
  run({ userId, newpassword }) {
    const user = Meteor.users.findOne(userId);

    if (!user)
      throw new Meteor.Error("users.setPassword.undefinedUser", "No such user.");
    else if (!this.userId)
      throw new Meteor.Error("users.setPassword.notAuthenticated", "Need to be logged in to set password.");
    else if (!RolesHelper.onlyAdmins(this.userId))
      throw new Meteor.Error("users.setPassword.notAuthorized", "Only admins can set passwords.");

    // Update password
    Accounts.setPassword(userId, newpassword);
  }
});

// Social logins

export const updateProfileFacebook = new ValidatedMethod({
  name: 'user.updateProfileFacebook',
  validate: new SimpleSchema({
    userId: { type: String },
  }).validator(),
  run({ userId }) {
    const user = Meteor.users.findOne(userId);

    if (!user)
      return;

    if (!propExistsDeep(user, ['profile', 'name'])) {
      let name = "";

      if (propExistsDeep(user, ['services', 'facebook', 'first_name'])) {
        name = user.services.facebook.first_name;
      }

      if (propExistsDeep(user, ['services', 'facebook', 'last_name'])) {
        if (name.length)
          name += " " + user.services.facebook.last_name;
        else
          name = user.services.facebook.last_name;
      }

      Meteor.users.update( { _id: user._id }, { $set: { 'profile.name': name } });
    }

    if (!propExistsDeep(user, ['profile', 'gender']))
      if (propExistsDeep(user, ['services', 'facebook', 'gender']))
        Meteor.users.update( { _id: user._id }, { $set: { 'profile.gender': UsersHelper.resolveGender(user.services.facebook.gender) } });

    if (propExistsDeep(user.services.facebook.email))
      if (!arrayContainsObjectMatch(user.emails, user.services.facebook.email))
        Meteor.users.update(user._id, { $push: { "emails": { address: user.services.facebook.email, verified: true } } });
  },
});

export const updateProfileGoogle = new ValidatedMethod({
  name: 'user.updateProfileGoogle',
  validate: new SimpleSchema({
    userId: { type: String },
  }).validator(),
  run({ userId }) {
    const user = Meteor.users.findOne(userId);

    if (!user)
      return;

    if (!propExistsDeep(user, ['profile', 'name'])) {
      let name = "";

      if (propExistsDeep(user, ['services', 'google', 'given_name'])) {
        name = user.services.google.given_name;
      }

      if (propExistsDeep(user, ['services', 'google', 'family_name'])) {
        if (name.length)
          name += " " + user.services.google.family_name;
        else
          name = user.services.google.family_name;
      }

      Meteor.users.update({ _id: user._id }, { $set: { 'profile.name': name } })
    }

    if (!propExistsDeep(user, ['profile', 'gender']))
      if (propExistsDeep(user, ['services', 'google', 'gender']))
        Meteor.users.update( { _id: user._id }, { $set: { 'profile.gender': UsersHelper.resolveGender(user.services.google.gender) } });

    if (propExistsDeep(user.services.google.email))
      if (!arrayContainsObjectMatch(user.emails, user.services.google.email))
        Meteor.users.update(user._id, { $push: { "emails": { address: user.services.google.email, verified: true } } });
  },
});

export const updateProfileIVLE = new ValidatedMethod({
  name: 'user.updateProfileIVLE',
  validate: new SimpleSchema({
    userId: { type: String },
  }).validator(),
  run({ userId }) {
    const user = Meteor.users.findOne(userId);

    if (!user)
      return;

    if (!propExistsDeep(user, ['profile', 'name']))
      if (propExistsDeep(user, ['services', 'ivle', 'name']))
        Meteor.users.update( { _id: user._id }, { $set: { 'profile.name': user.services.ivle.name } });

    if (propExistsDeep(user.services.ivle.email))
      if (!arrayContainsObjectMatch(user.emails, user.services.ivle.email))
        Meteor.users.update(user._id, { $push: { "emails": { address: user.services.ivle.email, verified: true } } });
  },
});

// Community

export const joinCommunity = new ValidatedMethod({
  name: 'user.joinCommunity',
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
  name: 'user.leaveCommunity',
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
  name: 'user.setHomeCommunity',
  validate: new SimpleSchema({
    community:{ type: Object, blackbox: true },
    userId:{ type: String },
  }).validator(),
  run({ insertOnly, community, userId }){
    const user = Meteor.users.findOne(userId);

    if (!user)
      return;

    Meteor.users.update({ _id: user._id }, { $set: {
      'profile.homeCommunityId': community._id,
      'profile.homeLocation': community.coordinates,
      'profile.homeZoom': community.zoom
    }});
  }
});

// Roles

// Only admins
export const banUser = new ValidatedMethod({
  name: 'user.banUser',
  validate: new SimpleSchema({
    userId:{  type: String },
  }).validator(),
  run({ userId }){
    const user = Meteor.users.findOne(userId);

    if (!user)
      throw new Meteor.Error("users.banUser.undefinedUser", "No such user.");
    else if (arrayContains(user.roles, 'banned'))
      throw new Meteor.Error("users.banUser.alreadyBanned", "User alrady banned.");
    else if (!RolesHelper.onlyAdmins(this.userId))
      throw new Meteor.Error("users.banUser.notAuthorized", "Only admins can ban users.");

    Meteor.users.update({ _id: user._id }, { $push: {
      roles: 'banned'
    }});
  }
});

// Only admins
export const unbanUser = new ValidatedMethod({
  name: 'user.unbanUser',
  validate: new SimpleSchema({
    userId:{  type: String },
  }).validator(),
  run({ userId }){
    const user = Meteor.users.findOne(userId);

    if (!user)
      throw new Meteor.Error("users.unbanUser.undefinedUser", "No such user.");
    else if (arrayContains(user.roles, 'banned'))
      throw new Meteor.Error("users.unbanUser.notBanned", "User isn't banned.");
    else if (!RolesHelper.onlyAdmins(this.userId))
      throw new Meteor.Error("users.unbanUser.notAuthorized", "Only admins can unban users.");

    Meteor.users.update({ _id: user._id }, { $pull: {
      roles: 'banned'
    }});
  }
});

if (Meteor.isServer) {

  // OAuth
  Meteor.methods({
    'user.addOauthCredentials': (token, secret, service) => {
      check(token, String);
      check(secret, String);
      check(service, String);

      const user = Meteor.user();

      if (!user)
        return;

      const services = user.services;
      let data = {};

      // Retrieve service data
      switch (service) {
        case "facebook":
          if (!services.facebook)
            services.facebook = Facebook.retrieveCredential(token, secret).serviceData;
          else
            throw new Meteor.Error(500, `You already have a linked ${capitalizeFirstLetter(service)} account with email ${services.facebook.email}...`);
          break;

        case "google":
          if (!services.google)
            services.google = Google.retrieveCredential(token, secret).serviceData;
          else
            throw new Meteor.Error(500, `You already have a linked ${capitalizeFirstLetter(service)} account with email ${services.google.email}...`);
          break;

        case "ivle":
          if (!services.ivle)
            services.ivle = IVLE.retrieveCredential(token, secret).serviceData;
          else
            throw new Meteor.Error(500, `You already have a linked ${capitalizeFirstLetter(service)} account with email ${services.ivle.email}...`);
          break;

        default:
          return;
      }

      // Check for existing user with ExternalService userId
      const serviceSearch = {};
      serviceSearch[`services.${service}.id`] = services[service].id;
      const oldUser = Meteor.users.findOne(serviceSearch);

      if (oldUser != null)
        throw new Meteor.Error(500, `Your ${capitalizeFirstLetter(service)} account has already been assigned to another user.`);

      // If clean, then update user's services
      Meteor.users.update(user._id, { $set: { services } });
    },

    'user.unlinkService': (service) => {
      check(service, String);
      const user = Meteor.user();

      if (!user)
        return;
      else if (!user.services[service])
        throw new Meteor.Error(500, `${service} service not found for user.`);

      const countServices = UsersHelper.countServices(user);
      if (countServices < 2)
        throw new Meteor.Error('user.unlinkService.cannotRemoveLastService', `Cannot unlink ${service}: last authentication method available.`);

      delete user.services[service];

      // Update user's services
      Meteor.users.update(user._id, { $set: { services: user.services } });
    },
  });

}
