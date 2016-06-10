import React from 'react';
import Radium from 'radium';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import DrawerNavigation from './drawer-navigation';

import AppBar from 'material-ui/AppBar';

var styles = {
  titleStyle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 400,
    letterSpacing: 4,
    textTransform: 'uppercase',
  }
};

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { drawerOpen: false };
  }

  openDrawer() {
    this.setState({ drawerOpen: true });
  }

  closeDrawer() {
    this.setState({ drawerOpen: false });
  }

  setDrawerOpen(open) {
    this.setState({ drawerOpen: !!open });
  }

  render() {
    return (
      <div id="header">
        <AppBar title="Free4All" titleStyle={ styles.titleStyle } onLeftIconButtonTouchTap={ this.openDrawer.bind(this) } />
        <DrawerNavigation isOpen={ this.state.drawerOpen } closeDrawer={ this.closeDrawer.bind(this) } setDrawerOpen={ this.setDrawerOpen.bind(this) } />
      </div>
    );
  }
}
