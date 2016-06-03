import { Meteor } from 'meteor/meteor';
import { ParentCategories } from '../parent-categories';

Meteor.publish('parent-categories', () => ParentCategories.find());
