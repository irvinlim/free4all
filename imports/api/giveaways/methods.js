import { Giveaways } from './giveaways';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insertDocument = new ValidatedMethod({
  name: 'giveaways.insert',
  validate: new SimpleSchema({
    title: { type: String },
  }).validator(),
  run(document) {
    Giveaways.insert(document);
  },
});

export const updateDocument = new ValidatedMethod({
  name: 'giveaways.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update.title': { type: String, optional: true },
  }).validator(),
  run({ _id, update }) {
    Giveaways.update(_id, { $set: update });
  },
});

export const removeDocument = new ValidatedMethod({
  name: 'giveaways.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Giveaways.remove(_id);
  },
});
