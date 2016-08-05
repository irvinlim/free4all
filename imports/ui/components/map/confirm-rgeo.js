import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import * as IconsHelper from '../../../util/icons';

export default class ConfirmRGeo extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      locName: "",
      locAddress: "",
      isConfirmOpen: false
    };

    this.confirmed = this.confirmed.bind(this);

  }

  componentWillReceiveProps(nextProps){
    const { locName, locAddress } = nextProps;

    // Change state before resets to null
    if(locName && locAddress)
      this.setState({ locName, locAddress, isConfirmOpen: true, });

  }

  confirmed(){
    this.props.openInsertDialog();
    this.setState({ isConfirmOpen: false });
  }

  render(){
    return (
      <div>
      { this.state.isConfirmOpen && this.state.locName.length > 0 &&
        <div id="confirm-rgeo-box" className="map-sidebar-box">

          <h3>{ ` ${ this.state.locName }` }</h3>
          <h5>{ ` ${ this.state.locAddress }` }</h5>

          <FloatingActionButton
            backgroundColor="#8bc34a"
            className="confirm-rgeo-btn"
            onTouchTap={ this.confirmed }>
          { IconsHelper.icon("check") }
          </FloatingActionButton>

        </div>
      }
      </div>
    )
  }
}
