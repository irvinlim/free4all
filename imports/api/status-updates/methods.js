import { StatusUpdates } from './status-update';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

// Non-reversible insertion. Must add new document to "update" it.
export const insertStatus = new ValidatedMethod({
  name: 'status-update.insert',
  validate: new SimpleSchema({
    title: { type: String },
  }).validator(),
  run(document) {
    StatusUpdates.insert(document);
  },
});
