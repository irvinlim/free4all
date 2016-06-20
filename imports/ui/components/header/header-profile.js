import React from 'react';
import { browserHistory } from 'react-router';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import { List, ListItem } from 'material-ui/List';
import * as Colors from 'material-ui/styles/colors';

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
        <IconButton onTouchTap={ this.props.openLogin }>
          <FontIcon className="material-icons" color={ Colors.grey50 }>person</FontIcon>
        </IconButton>
      </div>
    );
  }

  showProfileButton(user) {
    const gotourl = (url) => () => browserHistory.push(url);

    return (
      <div id="header-profile">
        <IconButton onTouchTap={ this.openPopover.bind(this) }>
          <Avatar src={ $.cloudinary.url("sample", { width: 64, height: 64, crop: 'fill' }) } />
        </IconButton>

        <Popover
          open={ this.state.open }
          onRequestClose={ this.closePopover.bind(this) }
          anchorEl={ this.state.anchorEl }
          anchorOrigin={{"horizontal":"right","vertical":"bottom"}}
          targetOrigin={{"horizontal":"right","vertical":"top"}}
          style={{ padding: '4px 0' }}>
          <List id="header-profile-popover">
            <ListItem primaryText="Profile" onTouchTap={ gotourl('/profile') } />
            <ListItem primaryText="Settings" onTouchTap={ gotourl('/settings') } />
            <ListItem primaryText="Log Out" onTouchTap={ getHandleLogout() } />
          </List>
        </Popover>
      </div>
    );
  }

  render() {
    return this.props.user ? this.showProfileButton(this.props.user) : this.noUser();
  }
}
