import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link, browserHistory } from 'react-router';
import AppBar from 'material-ui/AppBar';

import HeaderProfile from '../../containers/header/header-profile';
import HeaderNotifications from '../../containers/header/header-notifications';
import DrawerNavigation from './drawer-navigation';
import Login from '../../containers/auth/login';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
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

  openLogin(event) {
    this.context.store.dispatch({ type: 'OPEN_LOGIN_DIALOG' });
  }

  closeLogin(event) {
    this.context.store.dispatch({ type: 'CLOSE_LOGIN_DIALOG' });
  }

  appBarRight() {
    return (
      <div id="header-right-buttons" style={{ position:'absolute', top:8, right:8 }}>
        <HeaderProfile openLogin={ this.openLogin.bind(this) } />
        <HeaderNotifications />
        <Login />
      </div>
    );
  }

  render() {
    return (
      <div id="header">
        <AppBar
          id="header-bar"
          title="Free4All"
          onLeftIconButtonTouchTap={ this.openDrawer.bind(this) }
          iconElementRight={ this.appBarRight() } />
        <DrawerNavigation
          isOpen={ this.state.drawerOpen }
          closeDrawer={ this.closeDrawer.bind(this) }
          setDrawerOpen={ this.setDrawerOpen.bind(this) } />
      </div>
    );
  }
}

Header.contextTypes = {
  store: React.PropTypes.object
};
