import React from 'react';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import * as IconsHelper from '../../../util/icons';

export default class GoToHomeButton extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      this.props.homeLocation ?
      <FloatingActionButton 
        style={{marginBottom: "10px"}} 
        onTouchTap={ this.props.goToHomeLoc } >
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
  }
              
}