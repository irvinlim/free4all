import React from 'react';
import * as Colors from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import NotificationsList from '../../containers/header/notifications-list';

export default class HeaderNotifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleOnTouchTap(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div id="header-notifications">
        <IconButton onTouchTap={ this.handleOnTouchTap.bind(this) }>
          <FontIcon className="material-icons" color={ Colors.grey50 }>notifications</FontIcon>
        </IconButton>
        <Popover
          open={ this.state.open }
          anchorEl={ this.state.anchorEl }
          onRequestClose={ this.handleRequestClose.bind(this) }
          anchorOrigin={{"horizontal":"right","vertical":"bottom"}}
          targetOrigin={{"horizontal":"right","vertical":"top"}}
        >
          <NotificationsList />
        </Popover>
      </div>
    );
  }
}
