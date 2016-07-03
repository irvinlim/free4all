import React from 'react';
import Menu from 'material-ui/Menu';
import { ListGroup, Alert } from 'react-bootstrap';
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover';
import { AllCategoriesListItems } from './all-categories-list-items';

export const AllCategoriesList = ({ allCategories, props }) => (

  allCategories[0].length > 0 ?

    <Popover
      anchorEl ={props.anchorEl}
      anchorOrigin= {{horizontal:"left",vertical:"top"}}
      targetOrigin= {{horizontal:"left",vertical:"top"}}
      open={props.isCatMenuOpen}
      onRequestClose={props.closeCatMenu}
      animation={PopoverAnimationVertical}>
      <AllCategoriesListItems parentCategories={ allCategories[0] } categories={ allCategories[1] } clickHandler={ props.setChildCat } />
    </Popover> :
    <Popover
      anchorEl ={props.anchorEl}
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
      >
    </Popover>

)

AllCategoriesList.propTypes = {
  allCategories: React.PropTypes.array,
};
