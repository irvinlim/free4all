import React from 'react';
import { browserHistory } from 'react-router';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import * as Colors from 'material-ui/styles/colors';

import * as Helper from '../../../util/helper';
import * as UsersHelper from '../../../util/users';
import * as IconsHelper from '../../../util/icons';

import { getHandleLogout } from '../../../modules/logout';

export class HeaderProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // Reset popover state on login/logout.
    // != works the same way as XOR.
    if (prevProps.user != this.props.user)
      this.setState({ open: false });
  }

  openPopover(event) {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  closePopover(event) {
    this.setState({ open: false });
  }

  noUser() {
    return (
      <div id="header-profile">
        <IconButton id="login-button" onTouchTap={ this.props.openLogin } children={ IconsHelper.materialIcon("person", { color: Colors.grey50 }) } />
      </div>
    );
  }

  showProfileButton(user) {
    const gotourl = (url) => () => browserHistory.push(url);

    return (
      <div id="header-profile">
        <IconButton onTouchTap={ this.openPopover.bind(this) }>
          { UsersHelper.getAvatar(this.props.user, 40) }
        </IconButton>

        <Popover
          open={ this.state.open }
          onRequestClose={ this.closePopover.bind(this) }
          anchorEl={ this.state.anchorEl }
          anchorOrigin={{"horizontal":"right","vertical":"bottom"}}
          targetOrigin={{"horizontal":"right","vertical":"top"}}
          style={{ padding: '4px 0' }}>
          <List id="header-profile-popover">
            <ListItem leftIcon={ IconsHelper.icon("person") } primaryText="Profile" innerDivStyle={{ fontSize: 13 }} onTouchTap={ gotourl('/profile') } />
            <ListItem leftIcon={ IconsHelper.icon("folder_shared") } primaryText="My Giveaways" innerDivStyle={{ fontSize: 13 }} onTouchTap={ gotourl('/my-giveaways') } />
            <ListItem leftIcon={ IconsHelper.icon("group") } primaryText="My Communities" innerDivStyle={{ fontSize: 13 }} onTouchTap={ gotourl('/my-communities') } />
            <ListItem leftIcon={ IconsHelper.icon("settings") } primaryText="Settings" innerDivStyle={{ fontSize: 13 }} onTouchTap={ gotourl('/settings') } />
            <Divider />
            <ListItem leftIcon={ IconsHelper.icon("exit_to_app") } primaryText="Log Out" innerDivStyle={{ fontSize: 13 }} onTouchTap={ getHandleLogout() } />
          </List>
        </Popover>
      </div>
    );
  }

  render() {
    return this.props.user ? this.showProfileButton(this.props.user) : this.noUser();
  }
}
