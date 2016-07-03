import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import FontIcon from 'material-ui/FontIcon';

export const AllCategoriesListItems = ({ parentCategories, categories, clickHandler }) => (
  <Menu>
    { parentCategories.map(parentCat =>
      <MenuItem
      key={parentCat._id}
      primaryText={parentCat.name}
      rightIcon={<ArrowDropRight />}
      menuItems={
        categories.filter(child => child.parent === parentCat._id).map(cat =>
          <MenuItem
            name={cat.name}
            alt={cat.iconClass}
            primaryText={cat.name}
            leftIcon={<FontIcon className={cat.iconClass}></FontIcon>}
            onClick={clickHandler}
            id={cat._id}
            />
        )}
        />
    ) }
  </Menu>
);
