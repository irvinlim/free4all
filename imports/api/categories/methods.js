import { Categories } from './categories';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import * as RolesHelper from '../../util/roles';

export const insertCategory = new ValidatedMethod({
  name: 'categories.insert',
  validate: Categories.schema.validator(),
  run(category) {
    if (!RolesHelper.modsOrAdmins(this.userId))
      throw new Meteor.Error("categories.insert.notAuthorized", "Not authorized to insert category.");

    // Insert category
    return Categories.insert(category);
  },
});

export const updateCategory = new ValidatedMethod({
  name: 'categories.update',
  validate: new SimpleSchema({
    _id: { type: String },
    name: { type: String },
    iconClass: { type: String },
  }).validator(),
  run(category) {
    const cat = Categories.findOne(category._id);

    if (!cat)
      throw new Meteor.Error("categories.update.undefiendCategory", "No such category.");

    if (!RolesHelper.modsOrAdmins(this.userId))
      throw new Meteor.Error("categories.update.notAuthorized", "Not authorized to update category.");

    // Update category
    return Categories.update(category._id, { $set: category });
  },
});

// Only admins can remove categories
export const removeCategory = new ValidatedMethod({
  name: 'categories.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    const cat = Categories.findOne(_id);

    if (!cat)
      throw new Meteor.Error("categories.remove.undefiendCategory", "No such category.");

    if (!RolesHelper.onlyAdmins(this.userId))
      throw new Meteor.Error("categories.remove.notAuthorized", "Not authorized to remove category.");

    // Remove category
    return Categories.remove(_id);
  },
});
