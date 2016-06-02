import { Statuses } from './statuses';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insertStatus = new ValidatedMethod({
  name: 'statuses.insert',
  validate: new SimpleSchema({
    title: { type: String },
  }).validator(),
  run(document) {
    Statuses.insert(document);
  },
});

export const updateStatus = new ValidatedMethod({
  name: 'statuses.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update.title': { type: String, optional: true },
  }).validator(),
  run({ _id, update }) {
    Statuses.update(_id, { $set: update });
  },
});

export const removeStatus = new ValidatedMethod({
  name: 'statuses.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Statuses.remove(_id);
  },
});
