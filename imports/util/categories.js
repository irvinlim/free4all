import React from 'react';
import { Meteor } from 'meteor/meteor';

import { ParentCategories } from '../api/parent-categories/parent-categories';
import { Categories } from '../api/categories/categories';

export const getCategory = (catId) => Categories.findOne( catId );
export const getParentCategory = (cat) => ParentCategories.findOne( cat.parent ? cat.parent : Categories.findOne(cat) );
export const getMaybeCategory = (catOrParentId) => {
  const cat = Categories.findOne(catOrParentId);
  const parentCat = ParentCategories.findOne(catOrParentId);
  return cat ? cat : parentCat ? parentCat : undefined;
};

export const getOrderedParentCategories = () => ParentCategories.find({}, { sort: { relativeOrder: 1 } }).fetch();
export const getOrderedChildCategoriesOf = (parentCat) => Categories.find({ parent: parentCat._id ? parentCat._id : parentCat }, { sort: { relativeOrder: 1 } }).fetch();
