import { Meteor } from 'meteor/meteor';

// Subscribe to overpublished collections here.

Meteor.subscribe('parent-categories');
Meteor.subscribe('categories');
Meteor.subscribe('status-types');

// Disable overpublishing of current user data;
// breaks full-text search of users' names
//
// Tracker.autorun(function() {
//   Meteor.subscribe('user-data');
// });
