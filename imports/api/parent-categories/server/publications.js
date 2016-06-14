import { Meteor } from 'meteor/meteor';
import { ParentCategories } from '../parent-categories';
import { Categories } from '../../categories/categories';

Meteor.publish('parent-categories', () => ParentCategories.find());

Meteor.publish('all-categories', () => {
  return [ParentCategories.find(), Categories.find()];
})