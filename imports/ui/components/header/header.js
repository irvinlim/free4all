import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import DrawerNavigation from './drawer-navigation';
import HeaderNotifications from './header-notifications';

import AppBar from 'material-ui/AppBar';

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

  appBarRight() {
    return (
      <div>
        <HeaderNotifications />
      </div>
    );
  }

  render() {
    return (
      <div id="header">
        <AppBar id="header-bar" title="Free4All" onLeftIconButtonTouchTap={ this.openDrawer.bind(this) } iconElementRight={ this.appBarRight() } />
        <DrawerNavigation isOpen={ this.state.drawerOpen } closeDrawer={ this.closeDrawer.bind(this) } setDrawerOpen={ this.setDrawerOpen.bind(this) } />
      </div>
    );
  }
}
