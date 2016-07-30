import { Meteor } from 'meteor/meteor';

// Subscribe to overpublished collections here.

Meteor.subscribe('parent-categories');
Meteor.subscribe('categories');
Meteor.subscribe('status-types');
Meteor.subscribe('all-communities');

Tracker.autorun(function() {
  Meteor.subscribe('user-data');
});
