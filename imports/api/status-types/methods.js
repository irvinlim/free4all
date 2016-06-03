import { StatusTypes } from './status-types';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insertStatus = new ValidatedMethod({
  name: 'status-types.insert',
  validate: new SimpleSchema({
    title: { type: String },
  }).validator(),
  run(document) {
    StatusTypes.insert(document);
  },
});

export const updateStatus = new ValidatedMethod({
  name: 'status-types.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update.title': { type: String, optional: true },
  }).validator(),
  run({ _id, update }) {
    StatusTypes.update(_id, { $set: update });
  },
});

export const removeStatus = new ValidatedMethod({
  name: 'status-types.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    StatusTypes.remove(_id);
  },
});
