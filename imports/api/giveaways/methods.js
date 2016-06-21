import { Giveaways } from './giveaways';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insertGiveaway = new ValidatedMethod({
  name: 'giveaways.insert',
  validate: new SimpleSchema({
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
      label: 'ID of User who posted this giveaway'
    },
    deleted: {
      type: Boolean,
      label: 'Local deletion of giveaway',
      optional: true
    },
    batchId: {
      type: String,
      label: 'Batch ID when adding'
    }
  }).validator(),
  run(giveaway) {
    return Giveaways.insert(giveaway);
  },
});

export const updateGiveaway = new ValidatedMethod({
  name: 'giveaways.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update.title': { type: String, optional: true },
  }).validator(),
  run({ _id, update }) {
    Giveaways.update(_id, { $set: update });
  },
});

export const removeGiveaway = new ValidatedMethod({
  name: 'giveaways.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Giveaways.remove(_id);
  },
});
