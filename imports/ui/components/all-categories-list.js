import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Download from 'material-ui/svg-icons/file/file-download';

export const AllCategoriesList = ({ allCategories }) => (  
  allCategories.length > 0 ?
    <IconMenu
      iconButtonElement={<IconButton>Select Category<MoreVertIcon /></IconButton>}
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
      >
       {allCategories.map((parentCat) => (
            <MenuItem
            key={parentCat._id}
            primaryText={parentCat.name}
            rightIcon={<ArrowDropRight />}
            menuItems={
              parentCat.childCategories.map((cat) => (
                  <MenuItem 
                    key={cat.name}
                    value={{
                      parentId: parentCat._id,
                      child: cat.name
                    }}
                    primaryText={cat.name} 
                    leftIcon={<Download />} 
                    />
                ))
            }
            />
        ))}
      </IconMenu> :
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon />Select Category</IconButton>}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
      </IconMenu>
  
)

AllCategoriesList.propTypes = {
  allCategories: React.PropTypes.array,
};
