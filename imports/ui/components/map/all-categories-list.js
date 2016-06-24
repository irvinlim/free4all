import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

import * as IconsHelper from '../../../util/icons.js';

const categoriesList = ({ parentCategories, categories, props }) => parentCategories.map(parentCat =>
  <MenuItem
    key={ parentCat._id }
    primaryText={ parentCat.name }
    leftIcon={ IconsHelper.catIcon(parentCat) }
    rightIcon={ <ArrowDropRight /> }
    onTouchTap={ () => props.setParentCat(parentCat) }
    menuItems={
      categories
      .filter(child => child.parent === parentCat._id)
      .map(cat =>
        <MenuItem
          name={ cat.name }
          value={ cat._id }
          primaryText={ cat.name }
          leftIcon={ IconsHelper.catIcon(cat) }
          onClick={ () => props.setChildCat(cat) }
          id={ cat._id } />
      )
    } />
);

export const AllCategoriesList = ({ parentCategories, categories, props }) => (
  <IconMenu
    iconButtonElement={(
      <FlatButton
        label={ props.catSelected ? props.catSelected.name : "Choose a category" }
        icon={ props.catSelected ? IconsHelper.catIcon(props.catSelected) : IconsHelper.materialIcon("arrow_drop_down") }
        labelStyle={{ textTransform: "none", fontWeight: 400,  }} />
    )}
    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
    targetOrigin={{ horizontal: 'left', vertical: 'top' }}>

    { parentCategories.length > 0 ? categoriesList({ parentCategories, categories, props }) : <div /> }
  </IconMenu>
);

AllCategoriesList.propTypes = {
  allCategories: React.PropTypes.array,
};
