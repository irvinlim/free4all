import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

import { Giveaways } from '../../api/giveaways/giveaways';
import { StatusTypes } from '../../api/status-types/status-types';
import { ParentCategories } from '../../api/parent-categories/parent-categories';
import { Categories } from '../../api/categories/categories';

import { StatusUpdates } from '../../api/status-updates/status-updates';

// Default user account - delete before production
const users = [{
  email: 'admin@admin.com',
  password: 'password',
  profile: {
    name: { first: 'Carl', last: 'Winslow' },
  },
  roles: ['admin'],
}];

users.forEach(({ email, password, profile, roles }) => {
  const userExists = Meteor.users.findOne({ 'emails.address': email });

  if (!userExists) {
    const userId = Accounts.createUser({ email, password, profile });
    Roles.addUsersToRoles(userId, roles);
  }
});

// Default status types
const default_status_types = [
  { label: "Available", hexColour: "#57D224", relativeOrder: 10 },
  { label: "Running Out", hexColour: "#FF9E30", relativeOrder: 20 },
  { label: "Not Available", hexColour: "#DB184D", relativeOrder: 30 },
];

default_status_types.forEach(statusType => {
  if (!StatusTypes.findOne(statusType.label))
    StatusTypes.insert(statusType);
});

// Default parent categories
const default_parent_categories = [
  { name: "Food & Drink", icon: 'local_dining', relativeOrder: 10 },
  { name: "Coupons/Vouchers", icon: 'local_offer', relativeOrder: 20 },
  { name: "Goodie Bags", icon: 'local_mall', relativeOrder: 30 },
  { name: "Everything Else", icon: 'thumb_up', relativeOrder: 99 },
];

default_parent_categories.forEach(parentCat => {
  if (!ParentCategories.findOne({ 'name': parentCat.name }))
    ParentCategories.insert(parentCat);
});
