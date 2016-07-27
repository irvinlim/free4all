import { StatusTypes } from './status-types';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import * as RolesHelper from '../../util/roles';

export const insertStatusType = new ValidatedMethod({
  name: 'statusTypes.insert',
  validate: StatusTypes.schema.validator(),
  run(statusType) {
    if (!RolesHelper.modsOrAdmins(this.userId))
      throw new Meteor.Error("statusTypes.insert.notAuthorized", "Not authorized to insert status type.");

    // Insert status type
    return StatusTypes.insert(statusType);
  },
});

export const updateStatusType = new ValidatedMethod({
  name: 'statusTypes.update',
  validate: new SimpleSchema({
    _id: { type: String },
    label: { type: String },
    hexColour: { type: String },
  }).validator(),
  run(newStatusType) {
    const statusType = StatusTypes.findOne(newStatusType._id);

    if (!statusType)
      throw new Meteor.Error("statusTypes.update.undefinedStatusType", "No such status type.");

    if (!RolesHelper.modsOrAdmins(this.userId))
      throw new Meteor.Error("statusTypes.update.notAuthorized", "Not authorized to update status type.");

    // Update status type
    return StatusTypes.update(statusType._id, { $set: newStatusType });
  },
});

// Only admins can remove status types
export const removeStatusType = new ValidatedMethod({
  name: 'statusTypes.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    const statusType = StatusTypes.findOne(_id);

    if (!statusType)
      throw new Meteor.Error("statusTypes.remove.undefinedStatusType", "No such status type.");

    if (!RolesHelper.onlyAdmins(this.userId))
      throw new Meteor.Error("statusTypes.remove.notAuthorized", "Not authorized to remove status type.");

    // Remove status type
    return StatusTypes.remove(_id);
  },
});

export const reorderStatusType = new ValidatedMethod({
  name: 'statusTypes.reorder',
  validate: new SimpleSchema({
    _id: { type: String },
    newIndex: { type: Number },
  }).validator(),
  run({ _id, newIndex }) {
    const statusType = StatusTypes.findOne(_id);

    if (!statusType)
      throw new Meteor.Error("statusTypes.reorder.undefinedStatusType", "No such status type.");

    const oldIndex = statusType.relativeOrder;

    if (oldIndex < 0 || newIndex < 0)
      throw new Meteor.Error("statusTypes.reorder.indexOutOfBounds", "Invalid index provided.");

    // 1. Move status type to smallest side (< 0)
    return StatusTypes.update(_id, { $set: { relativeOrder: -100 } }, () => {
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

      return StatusTypes.update(selector, modifier, { multi: true }, () => {

        // 3. Move status type to newIndex
        return StatusTypes.update(_id, { $set: { relativeOrder: newIndex } });
      });
    });
  }
});
