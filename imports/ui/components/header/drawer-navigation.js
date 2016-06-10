import React from 'react';
import Drawer from 'material-ui/Drawer';
import DrawerMenuItems from '../../containers/drawer-menu-items.js';

export default class DrawerNavigation extends React.Component {
  render() {
    return (
      <Drawer docked={ false } width={ 250 } open={ this.props.isOpen } onRequestChange={ isOpen => this.props.setDrawerOpen(isOpen) }>
        <DrawerMenuItems closeDrawer={ this.props.closeDrawer } />
      </Drawer>
    );
  }
}

DrawerNavigation.propTypes = {
  isOpen: React.PropTypes.bool.isRequired,
  closeDrawer: React.PropTypes.func,
}
