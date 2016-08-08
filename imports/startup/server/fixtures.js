import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

import { StatusTypes } from '../../api/status-types/status-types';
import { ParentCategories } from '../../api/parent-categories/parent-categories';
import { Categories } from '../../api/categories/categories';
import { Communities } from '../../api/communities/communities';

// Default user account - delete before production
const users = [{
  email: 'admin@admin.com',
  password: 'password',
  profile: {
    name: "Admin User",
  },
  roles: ['admin'],
  homeLocation: [1.2993372,103.777426]
}];

users.forEach(({ email, password, profile, roles }) => {
  const adminUserExists = Meteor.users.findOne({ roles: 'admin' });

  if (!adminUserExists) {
    const userId = Accounts.createUser({ email, password, profile });
    Roles.addUsersToRoles(userId, roles);
  }
});

// Default communities
const adminUserId = Meteor.users.findOne({ roles: 'admin' })._id;
const default_communities = [
  { name:"NUS", feature: true, description: "National University of Singapore", ownerId: adminUserId, count:1, pictureId: "school-logos/nus-logo", website: "http://nus.edu.sg", coordinates: [1.2993372, 103.777426], zoom: 16, mapURL: "https://api.mapbox.com/styles/v1/leonmak/ciqri7cxi0004c3neujg0demt/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVvbm1hayIsImEiOiJkNzQ3YWVlZDczYjMxNjhhMjVhZWI4OWFkM2I2MWUwOCJ9.uL_x_vTDIse10HSvMb6XIg"},
  { name:"NTU", feature: true, description: "Nanyang Technological University of Singapore", ownerId: adminUserId, count:1, pictureId: "school-logos/ntu-logo", website: "http://ntu.edu.sg", coordinates: [1.3483105, 103.6831337], zoom: 16, mapURL: "https://api.mapbox.com/styles/v1/leonmak/cilzxkl5400hrcglvjxu6qxpz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVvbm1hayIsImEiOiJkNzQ3YWVlZDczYjMxNjhhMjVhZWI4OWFkM2I2MWUwOCJ9.uL_x_vTDIse10HSvMb6XIg"},
  { name:"SMU", feature: true, description: "Singapore Management University", ownerId: adminUserId, count:1, pictureId: "school-logos/smu-logo", website: "http://smu.edu.sg", coordinates: [1.296856, 103.850470], zoom: 18, mapURL: "https://api.mapbox.com/styles/v1/leonmak/ciqri96i70002cbnhztwxix8a/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVvbm1hayIsImEiOiJkNzQ3YWVlZDczYjMxNjhhMjVhZWI4OWFkM2I2MWUwOCJ9.uL_x_vTDIse10HSvMb6XIg"},
  { name:"SUTD", feature: true, description: "Singapore University of Technology & Design", ownerId: adminUserId, count:1, pictureId: "school-logos/sutd-logo", website: "http://sutd.edu.sg", coordinates: [1.341369, 103.963766], zoom: 18, mapURL: "https://api.mapbox.com/styles/v1/leonmak/ciqri96i70002cbnhztwxix8a/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVvbm1hayIsImEiOiJkNzQ3YWVlZDczYjMxNjhhMjVhZWI4OWFkM2I2MWUwOCJ9.uL_x_vTDIse10HSvMb6XIg"},
];

default_communities.forEach(comm => {
  if (!Communities.findOne({ 'name': comm.name })){
    Communities.insert(comm);
  }
});

// Default status types
const default_status_types = [
  { label: "Available", hexColour: "#57D224", relativeOrder: 0 },
  { label: "Running Out", hexColour: "#FF9E30", relativeOrder: 1 },
  { label: "Not Available", hexColour: "#DB184D", relativeOrder: 2 },
];

default_status_types.forEach(statusType => {
  if (!StatusTypes.findOne({ label: statusType.label }))
    StatusTypes.insert(statusType);
});

// Default parent categories
const default_parent_categories = [
  { name: "Food & Drink", iconClass: 'local_dining', relativeOrder: 0 },
  { name: "Everything Else", iconClass: 'thumb_up', relativeOrder: 1 },
];

default_parent_categories.forEach(parentCat => {
  if (!ParentCategories.findOne({ 'name': parentCat.name }))
    ParentCategories.insert(parentCat);
});

// Default categories
const default_categories = [
  { name: "Pizza", iconClass: 'fa fae-pizza', relativeOrder: 0, parent: ParentCategories.findOne({ name: "Food & Drink" })._id },
  { name: "Buffet", iconClass: 'restaurant', relativeOrder: 1, parent: ParentCategories.findOne({ name: "Food & Drink" })._id },
  { name: "Ice Cream", iconClass: 'fa fae-popsicle', relativeOrder: 2, parent: ParentCategories.findOne({ name: "Food & Drink" })._id },
  { name: "Coffee", iconClass: 'fa fa-coffee', relativeOrder: 3, parent: ParentCategories.findOne({ name: "Food & Drink" })._id },
];

default_categories.forEach(cat => {
  if (!Categories.findOne({ 'name': cat.name }))
    Categories.insert(cat);
});
