import React from 'react';
import { browserHistory } from 'react-router';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
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
    const avatarUrl = UsersHelper.getAvatarUrl(this.props.user, 40);

    return (
      <div id="header-profile">
        <IconButton onTouchTap={ this.openPopover.bind(this) }>
          { avatarUrl ? <Avatar src={ avatarUrl } size={40} /> :
                          UsersHelper.getFirstInitial(this.props.user) ?
                            <Avatar backgroundColor="#097381">{ UsersHelper.getFirstInitial(this.props.user) }</Avatar> :
                              IconsHelper.materialIcon("person", { color: Colors.grey50 })
          }
        </IconButton>

        <Popover
          open={ this.state.open }
          onRequestClose={ this.closePopover.bind(this) }
          anchorEl={ this.state.anchorEl }
          anchorOrigin={{"horizontal":"right","vertical":"bottom"}}
          targetOrigin={{"horizontal":"right","vertical":"top"}}
          style={{ padding: '4px 0' }}>
          <List id="header-profile-popover">
            <ListItem primaryText="My Giveaways" onTouchTap={ gotourl('/my-giveaways') } />
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
