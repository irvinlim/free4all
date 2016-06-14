import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Giveaways = new Mongo.Collection('Giveaways');

Giveaways.schema = new SimpleSchema({
  title: {
    type: String,
    label: 'The title of the giveaway',
  },
  description: {
    type: String,
    label: 'The description of the giveaway',
  },
  startDateTime: {
    type: Date,
    label: "Start date/time of the giveaway.",
  },
  endDateTime: {
    type: Date,
    label: "End date/time of the giveaway.",
  },
  location: {
    type: String,
    label: 'Localized name of location (reverse geocoded/user input)'
  },
  'coordinates': {
    type: [Number],
    decimal: true,
    minCount: 2,
    maxCount: 2,
    label: 'Array of coordinates in MongoDB style \[Lng, Lat\]'
  },
  'categoryId' :{
    type: String,
    label: 'ID of giveaway\'s category'
  },
  'tags': {
    type: [String],
    label: 'The tags/hashtags for the giveaway',
    optional: true
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of User who posted this giveaway'
  },
  deleted: {
    type: Boolean,
    label: 'Local deletion of giveaway',
    optional: true
  }
});

Giveaways.attachSchema(Giveaways.schema);

if (Meteor.isServer) {
  Giveaways._ensureIndex({'coordinates':'2dsphere'});
}
