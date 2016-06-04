// import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/dburles:factory';

export const Giveaways = new Mongo.Collection('Giveaways');

Giveaways.schema = new SimpleSchema({
  title: {
    type: String,
    label: 'The title of the giveaway.',
  },
  description: {
    type: String,
    label: 'The description of the giveaway.',
  },
  dateStart: {
    type: Date,
    label: "Start date/time of the giveaway.",
  },
  dateEnd: {
    type: Date,
    label: "End date/time of the giveaway.",
  },
  location: {
    type: String,
    label: 'Localized name of location (reverse geocoded).'
  },
  'coordinates': {
    type: [Number],
    decimal: true,
    minCount: 2,
    maxCount: 2,
    label: 'Array of coordinates in MongoDB style \[Lng, Lat\].'
  },
  'categoryId' :{
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of User who posted this giveaway.'
  },
  'tags': {
    type: [String],
    label: 'The tags/hashtags for the giveaway.',
    optional: true
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of User who posted this giveaway.'
  },
});

Giveaways.attachSchema(Giveaways.schema);

// Factory.define('document', Giveaways, {
//   title: () => faker.hacker.phrase(),
// });
