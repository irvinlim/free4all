import React from 'react';
import Subheader from 'material-ui/Subheader';
import { GridList, GridTile } from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import ReactList from 'react-list';
import { Card, CardActions, CardText, CardHeader, CardTitle } from 'material-ui/Card';
import Link, { LinkButton } from '../../layouts/link';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import * as UsersHelper from '../../../util/users';
import * as IconsHelper from '../../../util/icons';
import * as RolesHelper from '../../../util/roles';

import { Communities } from '../../../api/communities/communities';
import { banUser, unbanUser } from '../../../api/users/methods';

let users = [];

const makeChip = (role, index) => {
  let label;

  if (role == "moderator") {
    label = "Mod";
  } else if (role == "admin") {
    label = "Admin";
  } else {
    return null;
  }

  return (
    <Chip key={index} backgroundColor="#8595b7" labelStyle={{ fontSize: 12, textTransform: 'uppercase', color: "#fff", lineHeight: "24px", padding: "0 8px" }}>
      { label }
    </Chip>
  );
};

const communityDisplay = (community, isHome=false) => (
  <span className="community-display" key={community._id}>
    { isHome ? IconsHelper.icon("home", { color: "#9c9c9c", fontSize: "16px", marginRight: 3 }) : null }
    { community.name }
  </span>
);

export class ManageUsersItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmBanDialogOpen: false,
      confirmUser: null,
    };
  }

  handleBanUnbanUser() {
    const user = this.state.confirmUser;
    const self = this;

    if (!user)
      return;

    const action = RolesHelper.isBanned(user) ? unbanUser : banUser;
    const actionWord = RolesHelper.isBanned(user) ? "unbanned" : "banned";
    action.call({ userId: user._id }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert(`Successfully ${actionWord} user.`, 'success');
        self.handleCloseConfirmBanDialog();
      }
    });
  }

  handleCloseConfirmBanDialog() {
    this.setState({ confirmBanDialogOpen: false, confirmUser: null });
  }

  renderItem(index, key) {
    const self = this;

    const user = users[index];
    const homeCommunity = user.homeCommunityId ? Communities.findOne(user.homeCommunityId) : null;
    const userCommunities = user.communityIds ? Communities.find({ _id: { $in: user.communityIds.filter(x => x !== user.homeCommunityId) } }) : null;

    return (
      <Card key={ key } style={{ marginBottom: 20 }} className="manage-users-item profile">
        <CardHeader
          title={
            <h3 style={{ marginTop: 0 }}>
              { UsersHelper.getFullName(user) }
              { user.roles ? <span className="role-chips">{ user.roles.map(makeChip) }</span> : null }
            </h3>
          }
          subtitle={
            <p className="manage-users-subtitle">
              { UsersHelper.adminGetFirstEmail(user) }
              <br/>
              <span className="user-communities-display">
                { homeCommunity ? communityDisplay(homeCommunity, true) : null }
                { userCommunities ? userCommunities.map(communityDisplay) : null }
              </span>
            </p>
          }
          avatar={ UsersHelper.getAvatar(user, 80) }
          />

        <CardActions>
          <LinkButton label="View Profile" to={ `/profile/${user._id}` } />
          <LinkButton label="Edit Profile" to={ `/manage/users/${user._id}` } />
          <FlatButton label={ RolesHelper.isBanned(user._id) ? "Unban User" : "Ban User" } onTouchTap={ e => self.setState({ confirmBanDialogOpen: true, confirmUser: user }) } />
        </CardActions>
      </Card>
    );
  }

  render() {
    users = this.props.users;

    const confirmBanDialogActions = [
      <FlatButton label="Cancel" onTouchTap={ this.handleCloseConfirmBanDialog.bind(this) } />,
      <FlatButton label="Confirm" onTouchTap={ this.handleBanUnbanUser.bind(this) } />
    ];

    return (
      <div id="manage-users-items">
        <ReactList
          itemRenderer={ this.renderItem.bind(this) }
          length={ users.length }
          type='variable'
        />

        <Dialog
          title="Are you sure?"
          open={ this.state.confirmBanDialogOpen }
          actions={ confirmBanDialogActions }
          onRequestClose={ this.handleCloseConfirmBanDialog.bind(this) }>
          <p>Are you sure you want to { RolesHelper.isBanned(this.state.confirmUser) ? "unban" : "ban" } this user?</p>
        </Dialog>
      </div>
    );
  }
}
