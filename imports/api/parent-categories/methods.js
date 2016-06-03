import { ParentCategories } from './parent-categories';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insertCategory = new ValidatedMethod({
  name: 'parent-categories.insert',
  validate: new SimpleSchema({
    title: { type: String },
  }).validator(),
  run(document) {
    ParentCategories.insert(document);
  },
});

export const updateCategory = new ValidatedMethod({
  name: 'parent-categories.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update.title': { type: String, optional: true },
  }).validator(),
  run({ _id, update }) {
    ParentCategories.update(_id, { $set: update });
  },
});

export const removeCategory = new ValidatedMethod({
  name: 'parent-categories.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    ParentCategories.remove(_id);
  },
});
