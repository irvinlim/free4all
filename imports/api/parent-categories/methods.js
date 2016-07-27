import { ParentCategories } from './parent-categories';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import * as RolesHelper from '../../util/roles';

export const insertParentCategory = new ValidatedMethod({
  name: 'parentCategories.insert',
  validate: ParentCategories.schema.validator(),
  run(parentCategory) {
    if (!RolesHelper.modsOrAdmins(this.userId))
      throw new Meteor.Error("parentCategories.insert.notAuthorized", "Not authorized to insert category.");

    // Insert parent category
    return ParentCategories.insert(parentCategory);
  },
});

export const updateParentCategory = new ValidatedMethod({
  name: 'parentCategories.update',
  validate: new SimpleSchema({
    _id: { type: String },
    name: { type: String },
    iconClass: { type: String },
  }).validator(),
  run(parentCategory) {
    const parentCat = ParentCategories.findOne(parentCategory._id);

    if (!parentCat)
      throw new Meteor.Error("parentCategories.update.undefinedParentCategory", "No such parent category.");

    if (!RolesHelper.modsOrAdmins(this.userId))
      throw new Meteor.Error("parentCategories.update.notAuthorized", "Not authorized to update parent category.");

    // Update parent category
    return ParentCategories.update(parentCategory._id, { $set: parentCategory });
  },
});

// Only admins can remove categories
export const removeParentCategory = new ValidatedMethod({
  name: 'parentCategories.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    const parentCat = ParentCategories.findOne(_id);

    if (!parentCat)
      throw new Meteor.Error("parentCategories.remove.undefinedParentCategory", "No such parent category.");

    if (!RolesHelper.onlyAdmins(this.userId))
      throw new Meteor.Error("parentCategories.remove.notAuthorized", "Not authorized to remove parent category.");

    // Remove parent category
    return ParentCategories.remove(_id);
  },
});

export const reorderParentCategory = new ValidatedMethod({
  name: 'parentCategories.reorder',
  validate: new SimpleSchema({
    _id: { type: String },
    newIndex: { type: Number },
  }).validator(),
  run({ _id, newIndex }) {
    const parentCat = ParentCategories.findOne(_id);

    if (!parentCat)
      throw new Meteor.Error("parentCategories.reorder.undefinedParentCategory", "No such parent category.");

    const oldIndex = parentCat.relativeOrder;

    if (oldIndex < 0 || newIndex < 0)
      throw new Meteor.Error("parentCategories.reorder.indexOutOfBounds", "Invalid index provided.");

    // 1. Move parent category to smallest side (< 0)
    return ParentCategories.update(_id, { $set: { relativeOrder: -100 } }, () => {
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

      return ParentCategories.update(selector, modifier, { multi: true }, () => {

        // 3. Move parent category to newIndex
        return ParentCategories.update(_id, { $set: { relativeOrder: newIndex } });
      });
    });
  }
});
