import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Download from 'material-ui/svg-icons/file/file-download';
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover';

const categoriesList = ({ parentCategories, categories, props }) => (
  <IconMenu
    iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
    onItemTouchTap={ props.setParentCat }>

    { parentCategories.map(parentCat =>
      <MenuItem
        key={ parentCat._id }
        primaryText={ parentCat.name }
        rightIcon={ <ArrowDropRight /> }
        menuItems={
          categories
          .filter(child => child.parent === parentCat._id)
          .map(cat =>
            <MenuItem
              name={ cat.name }
              value={ cat._id }
              primaryText={ cat.name }
              leftIcon={ <Download /> }
              onClick={ props.setChildCat }
              id={ cat._id } />
          )
        } />
    ) }

  </IconMenu>
);

const noCategories = () => (
  <IconMenu
    iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
    targetOrigin={{ horizontal: 'left', vertical: 'top' }}>
  </IconMenu>
);

export const AllCategoriesList = ({ parentCategories, categories, props }) => (
  <div id="all-categories-list">
    { parentCategories.length > 0 ? categoriesList({ parentCategories, categories, props }) : noCategories() }
  </div>
);

AllCategoriesList.propTypes = {
  allCategories: React.PropTypes.array,
};
