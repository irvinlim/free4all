import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Download from 'material-ui/svg-icons/file/file-download';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

export const AllCategoriesList = ({ allCategories, props}) => (

  allCategories[0].length > 0 ?
  
    <Popover
      anchorEl ={props.anchorEl}
      anchorOrigin= {{horizontal:"left",vertical:"top"}}
      targetOrigin= {{horizontal:"left",vertical:"top"}}
      open={props.isCatMenuOpen}
      onRequestClose={props.closeCatMenu}
      animation={PopoverAnimationVertical}
      >
      <Menu>
      {/* allCat[0] - parent, allCat[1] - child*/}
       {allCategories[0].map((parentCat) => (
            <MenuItem
            key={parentCat._id}
            primaryText={parentCat.name}
            rightIcon={<ArrowDropRight />}
            menuItems={
              allCategories[1]
              .filter((child)=>{return child.parent === parentCat._id})
              .map((cat) => (
                  <MenuItem 
                    name={cat.name}
                    alt={cat.iconClass}
                    primaryText={cat.name} 
                    leftIcon={<FontIcon className={cat.iconClass}></FontIcon>}
                    onClick={props.setChildCat}
                    id={cat._id}

                    />
                ))
            }
            />
        ))}
      </Menu>
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
