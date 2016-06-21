import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import Menu from 'material-ui/Menu';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Download from 'material-ui/svg-icons/file/file-download';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';

export const AllCategoriesList = ({ allCategories, props}) => (  
  allCategories[0].length > 0 ?
  
    <IconMenu
      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
      onItemTouchTap={props.setParentCat}
      >

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
                    value={cat._id}
                    primaryText={cat.name} 
                    leftIcon={<Download />}
                    onClick={props.setChildCat}
                    id={cat._id}

                    />
                ))
            }
            />
        ))}
      </IconMenu> :
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
      </IconMenu>
  
)

AllCategoriesList.propTypes = {
  allCategories: React.PropTypes.array,
};
