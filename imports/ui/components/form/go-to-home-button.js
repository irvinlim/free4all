import React from 'react';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import * as IconsHelper from '../../../util/icons';

const GoToHomeButton = props => (

  props.homeLocation ?
  <FloatingActionButton
    onTouchTap={ props.goToHomeLoc } >
    { IconsHelper.materialIcon("home") }
  </FloatingActionButton>
  :
  <div>
    <IconButton
      tooltip="Home Location not set"
      style={{ zIndex: 1, position: "absolute" }} />
    <FloatingActionButton disabled={true} >
      { IconsHelper.materialIcon("home", {color:"black"}) }
    </FloatingActionButton>
  </div>
)

export default GoToHomeButton;
