import { Communities } from './communities';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insertCommunity = new ValidatedMethod({
  name: 'communities.insert',
  validate: new SimpleSchema({
    title: { type: String },
  }).validator(),
  run(document) {
    Communities.insert(document);
  },
});

export const updateCommunity = new ValidatedMethod({
  name: 'communities.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update.title': { type: String, optional: true },
  }).validator(),
  run({ _id, update }) {
    Communities.update(_id, { $set: update });
  },
});

export const removeCommunity = new ValidatedMethod({
  name: 'communities.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Communities.remove(_id);
  },
});
