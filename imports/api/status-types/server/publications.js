import { Meteor } from 'meteor/meteor';
import { StatusTypes } from '../status-types';

Meteor.publish('status-types', () => StatusTypes.find());
