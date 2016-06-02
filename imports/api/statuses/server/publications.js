import { Meteor } from 'meteor/meteor';
import { Categories } from '../categories';

Meteor.publish('categories', () => Categories.find());
