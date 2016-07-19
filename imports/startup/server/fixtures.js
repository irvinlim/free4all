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
    firstName: "Admin",
    lastName: "User"
  },
  roles: ['admin'],
  home_location: [1.2993372,103.777426],
}];

users.forEach(({ email, password, profile, roles }) => {
  const userExists = Meteor.users.findOne({ 'emails.address': email });

  if (!userExists) {
    const userId = Accounts.createUser({ email, password, profile });
    Roles.addUsersToRoles(userId, roles);
    
    // Default communities
    const default_communities = [
      { name:"NUS", description: "National University of Singapore", ownerId: userId, count:1, pictureId: "nuslogo_zx2viu_cckvxo", website: "http://nus.edu.sg", coordinates: [1.2993372,103.777426], zoom: 16, mapURL: "https://api.mapbox.com/styles/v1/leonmak/ciqri7cxi0004c3neujg0demt/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVvbm1hayIsImEiOiJkNzQ3YWVlZDczYjMxNjhhMjVhZWI4OWFkM2I2MWUwOCJ9.uL_x_vTDIse10HSvMb6XIg"},
      { name:"NTU", description: "Nanyang Technological University of Singapore", ownerId: userId, count:1, pictureId: "ntulogo_cbk4vh", website: "http://ntu.edu.sg", coordinates: [1.3484298,103.6837826], zoom: 16, mapURL: "https://api.mapbox.com/styles/v1/leonmak/cilzxkl5400hrcglvjxu6qxpz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVvbm1hayIsImEiOiJkNzQ3YWVlZDczYjMxNjhhMjVhZWI4OWFkM2I2MWUwOCJ9.uL_x_vTDIse10HSvMb6XIg"},
      { name:"SMU", description: "Singapore Management University", ownerId: userId, count:1, pictureId: "smulogo_xfitp3", website: "http://smu.edu.sg", coordinates: [1.2969614,103.8513713], zoom: 18, mapURL: "https://api.mapbox.com/styles/v1/leonmak/ciqri96i70002cbnhztwxix8a/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVvbm1hayIsImEiOiJkNzQ3YWVlZDczYjMxNjhhMjVhZWI4OWFkM2I2MWUwOCJ9.uL_x_vTDIse10HSvMb6XIg"},
    ];

    default_communities.forEach(comm => {
      if (!Communities.findOne({ 'name': comm.name })){
        const commId = Communities.insert(comm);
        Meteor.users.update(userId, { $push:{ communityIds: commId } });
      }
    });

  }
});

// Default status types
const default_status_types = [
  { label: "Available", hexColour: "#57D224", relativeOrder: 10 },
  { label: "Running Out", hexColour: "#FF9E30", relativeOrder: 20 },
  { label: "Not Available", hexColour: "#DB184D", relativeOrder: 30 },
];

default_status_types.forEach(statusType => {
  if (!StatusTypes.findOne({ label: statusType.label }))
    StatusTypes.insert(statusType);
});

// Default parent categories
const default_parent_categories = [
  { name: "Food & Drink", iconClass: 'local_dining', relativeOrder: 10 },
  { name: "Coupons/Vouchers", iconClass: 'local_offer', relativeOrder: 20 },
  { name: "Goodie Bags", iconClass: 'local_mall', relativeOrder: 30 },
  { name: "Everything Else", iconClass: 'thumb_up', relativeOrder: 99 },
];

default_parent_categories.forEach(parentCat => {
  if (!ParentCategories.findOne({ 'name': parentCat.name }))
    ParentCategories.insert(parentCat);
});

// Default categories
const default_categories = [
  { name: "Pizza", iconClass: 'fa fae-pizza', relativeOrder: 10, parent: ParentCategories.findOne({ name: "Food & Drink" })._id },
  { name: "Buffet", iconClass: 'restaurant', relativeOrder: 11, parent: ParentCategories.findOne({ name: "Food & Drink" })._id },
  { name: "Ice Cream", iconClass: 'fa fae-popsicle', relativeOrder: 12, parent: ParentCategories.findOne({ name: "Food & Drink" })._id },
  { name: "Coffee", iconClass: 'fa fa-coffee', relativeOrder: 13, parent: ParentCategories.findOne({ name: "Food & Drink" })._id },
];

default_categories.forEach(cat => {
  if (!Categories.findOne({ 'name': cat.name }))
    Categories.insert(cat);
});


