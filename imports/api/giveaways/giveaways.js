// import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/dburles:factory';

import { Categories } from '../categories/categories';
import { Statuses } from '../statuses/statuses';

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
    label: 'Array of coordinates in MongoDB style \[Lng, Lat\].'
  },
  'category' :{
    type: Categories.schema,
  },
  'tags': {
    type: [String],
    label: 'The tags/hashtags for the giveaway.',
    optional: true
  },
  'status': {
    type: [Object],
    label: 'All status updates for this giveaway.'
  },
  'status.type': {
    type: Statuses.schema,
    label: 'Status type.'
  },
  'status.date': {
    type: Date,
    label: 'Date that the status was set.'
  },
  'status.userId': {
    type: Date,
    label: 'User ID of person who updated this status.'
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'User ID of user who posted this giveaway.'
  },
});

Giveaways.attachSchema(Giveaways.schema);

// Factory.define('document', Giveaways, {
//   title: () => faker.hacker.phrase(),
// });
