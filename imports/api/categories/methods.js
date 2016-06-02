import { Categories } from './categories';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insertCategory = new ValidatedMethod({
  name: 'categories.insert',
  validate: new SimpleSchema({
    title: { type: String },
  }).validator(),
  run(document) {
    Categories.insert(document);
  },
});

export const updateCategory = new ValidatedMethod({
  name: 'categories.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update.title': { type: String, optional: true },
  }).validator(),
  run({ _id, update }) {
    Categories.update(_id, { $set: update });
  },
});

export const removeCategory = new ValidatedMethod({
  name: 'categories.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Categories.remove(_id);
  },
});
