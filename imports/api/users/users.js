import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const UsersSchema = {};

UsersSchema.UserCountry = new SimpleSchema({
  name: {
    type: String
  },
  code: {
    type: String,
    regEx: /^[A-Z]{2}$/
  }
});

UsersSchema.UserProfile = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  birthday: {
    type: Date,
    optional: true
  },
  gender: {
    type: String,
    allowedValues: ['Male', 'Female', 'Others'],
    optional: true
  },
  organization : {
    type: String,
    optional: true
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  bio: {
    type: String,
    optional: true
  },
  country: {
    type: UsersSchema.UserCountry,
    optional: true
  },
  avatarId: {
    type: String,
    optional: true
  },
});

UsersSchema.Data = new SimpleSchema({
  username: {
    type: String,
    optional: true
  },
  emails: {
    type: Array,
    optional: true
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  registered_emails: {
    type: [Object],
    optional: true,
    blackbox: true
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: UsersSchema.UserProfile,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true
  },
  communityIds:{
    type: Array,
    optional: true
  },
  "communityIds.$":{
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  homeLocation: {
    type: [Number],
    decimal: true,
    minCount: 2,
    maxCount: 2,
    label: 'Array of coordinates in MongoDB style \[Lng, Lat\]',
    optional: true
  },
  homeZoom:{
    type: Number,
    optional: true
  },
  homeCommunityId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  }
});

Meteor.users.attachSchema(UsersSchema.Data);
