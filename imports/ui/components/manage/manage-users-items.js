import React from 'react';
import Subheader from 'material-ui/Subheader';
import { GridList, GridTile } from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import ReactList from 'react-list';
import { Card, CardActions, CardText, CardHeader, CardTitle } from 'material-ui/Card';
import PaperCard from '../../layouts/paper-card';
import Link, { LinkButton } from '../../layouts/link';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import * as UsersHelper from '../../../util/users';
import * as IconsHelper from '../../../util/icons';
import * as RolesHelper from '../../../util/roles';

import { Communities } from '../../../api/communities/communities';
import { banUser, unbanUser, deleteUser } from '../../../api/users/methods';

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

const DialogUser = ({ open, handleClose, handleSubmit, children }) => {
  const actions = [
    <FlatButton label="Cancel" onTouchTap={ handleClose } />,
    <FlatButton label="Confirm" onTouchTap={ handleSubmit } />
  ];

  return (
    <Dialog
      title="Are you sure?"
      open={ open }
      actions={ actions }
      onRequestClose={ handleClose }>
      { children }
    </Dialog>
  );
};

export class ManageUsersItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmBanDialogOpen: false,
      confirmDeleteDialogOpen: false,
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

  handleDeleteUser() {
    const user = this.state.confirmUser;
    const self = this;

    if (!user)
      return;

    deleteUser.call({ userId: user._id }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert("Successfully deleted user.", 'success');
        self.handleCloseConfirmDeleteDialog();
      }
    });
  }

  handleCloseConfirmBanDialog() {
    this.setState({ confirmBanDialogOpen: false, confirmUser: null });
  }

  handleCloseConfirmDeleteDialog() {
    this.setState({ confirmDeleteDialogOpen: false, confirmUser: null });
  }

  renderItem(index, key) {
    const self = this;

    const user = users[index];
    const homeCommunity = user.profile.homeCommunityId ? Communities.findOne(user.profile.homeCommunityId) : null;
    const userCommunities = user.communityIds ? Communities.find({ _id: { $in: user.communityIds.filter(x => x !== user.profile.homeCommunityId) } }) : null;

    return (
      <PaperCard key={ key } className="manage-users-item profile">
        <CardHeader
          title={
            <h3 style={{ marginTop: 0 }}>
              { UsersHelper.getFullName(user) }
              { user.roles ? <span className="role-chips">{ user.roles.map(makeChip) }</span> : null }
            </h3>
          }
          subtitle={
            <p className="manage-users-subtitle">
              <span className="user-communities-display">
                { homeCommunity ? communityDisplay(homeCommunity, true) : null }
                { userCommunities ? userCommunities.map(comm => communityDisplay(comm, false)) : null }
              </span>
              <br/>
              { UsersHelper.adminGetFirstEmail(user) }
            </p>
          }
          avatar={ UsersHelper.getAvatar(user, 80) }
          />

        <CardActions style={{ marginBottom: 10 }}>
          <LinkButton label="View Profile" to={ `/profile/${user._id}` } />
          <LinkButton label="Edit Profile" to={ `/manage/users/${user._id}` } />
          <FlatButton label={ RolesHelper.isBanned(user._id) ? "Unban User" : "Ban User" } onTouchTap={ e => self.setState({ confirmBanDialogOpen: true, confirmUser: user }) } />
          <FlatButton label="Delete User" onTouchTap={ e => this.setState({ confirmDeleteDialogOpen: true, confirmUser: user }) } />
        </CardActions>
      </PaperCard>
    );
  }

  render() {
    users = this.props.users;

    return (
      <div id="manage-users-items">
        <ReactList
          itemRenderer={ this.renderItem.bind(this) }
          length={ users.length }
          type='uniform'
        />

        <DialogUser
          open={ this.state.confirmBanDialogOpen }
          handleClose={ this.handleCloseConfirmBanDialog.bind(this) }
          handleSubmit={ this.handleBanUnbanUser.bind(this) }>
          <p>Are you sure you want to { RolesHelper.isBanned(this.state.confirmUser) ? "unban" : "ban" } this user?</p>
        </DialogUser>

        <DialogUser
          open={ this.state.confirmDeleteDialogOpen }
          handleClose={ this.handleCloseConfirmDeleteDialog.bind(this) }
          handleSubmit={ this.handleDeleteUser.bind(this) }>
          <p>Are you sure you want to delete this user? This actions is <strong>irreversible</strong>!!!</p>
          <p>Note that any recovery of the user will have to be done manually in the database.</p>
        </DialogUser>
      </div>
    );
  }
}
