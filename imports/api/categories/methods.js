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
      throw new Meteor.Error("categories.update.undefinedCategory", "No such category.");

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
      throw new Meteor.Error("categories.remove.undefinedCategory", "No such category.");

    if (!RolesHelper.onlyAdmins(this.userId))
      throw new Meteor.Error("categories.remove.notAuthorized", "Not authorized to remove category.");

    // Remove category
    return Categories.remove(_id);
  },
});

export const reorderCategory = new ValidatedMethod({
  name: 'categories.reorder',
  validate: new SimpleSchema({
    _id: { type: String },
    newIndex: { type: Number },
  }).validator(),
  run({ _id, newIndex }) {
    const cat = Categories.findOne(_id);

    if (!cat)
      throw new Meteor.Error("categories.reorder.undefinedCategory", "No such category.");

    const oldIndex = cat.relativeOrder;

    if (oldIndex < 0 || newIndex < 0)
      throw new Meteor.Error("categories.reorder.indexOutOfBounds", "Invalid index provided.");

    // 1. Move category to smallest side (< 0)
    return Categories.update(_id, { $set: { relativeOrder: -100 } }, () => {
      let selector, modifier;

      // 2. If oldIndex < newIndex, move everything from [oldIndex + 1, newIndex] to decrement by 1
      //    If oldIndex > newIndex, move everything from [newIndex, oldIndex - 1] to increment by 1
      if (oldIndex < newIndex) {
        selector = { relativeOrder: { $gt: oldIndex, $lte: newIndex } };
        modifier = { $inc: { relativeOrder: -1 } };
      } else {
        selector = { relativeOrder: { $gte: newIndex, $lt: oldIndex } };
        modifier = { $inc: { relativeOrder: 1 } };
      }

      return Categories.update(selector, modifier, { multi: true }, () => {

        // 3. Move category to newIndex
        return Categories.update(_id, { $set: { relativeOrder: newIndex } });
      });
    });
  }
})
