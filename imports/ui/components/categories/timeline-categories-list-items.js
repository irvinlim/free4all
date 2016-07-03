import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

import * as IconsHelper from '../../../util/icons';
import * as CategoriesHelper from '../../../util/categories';

const ListItem = (category, isChild) => (
  <MenuItem
    key={ category._id }
    value={ category._id }
    primaryText={ category.name }
    insetChildren={ isChild }
    />
);

export const TimelineCategoriesListItems = ({ itemsFilter }) => {
  let cats = CategoriesHelper.getOrderedParentCategories();

  if (itemsFilter)
    cats = itemsFilter(cats);

  const items = [];

  cats.forEach(cat => {
    items.push(cat);
    CategoriesHelper.getOrderedChildCategoriesOf(cat).forEach(child => items.push(child));
  });

  return items.map(cat => ListItem(cat, !!cat.parent));
};
