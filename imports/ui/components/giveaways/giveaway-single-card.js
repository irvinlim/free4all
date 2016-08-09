import { Meteor } from 'meteor/meteor';
import React from 'react';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import PaperCard from '../../layouts/paper-card';
import FlatButton from 'material-ui/FlatButton';

import ConfirmDialog from '../../layouts/confirm-dialog';
import RemoveGiveawayDialog from '../form/remove-giveaway-dialog';
import Link from '../../layouts/link';

import * as Colors from 'material-ui/styles/colors';
import { makeLink, pluralizer } from '../../../util/helper';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as AvatarHelper from '../../../util/avatar';
import * as IconsHelper from '../../../util/icons';
import * as RolesHelper from '../../../util/roles';
import * as UsersHelper from '../../../util/users';

import { flagGiveaway, unflagGiveaway, removeFlaggedGiveaway, restoreGiveaway } from '../../../api/giveaways/methods';

let giveaway = null;

const iconRow = (icon, content) => {
  if (content)
    return (
      <div className="info-row">
        <div className="info-row-icon">
          { IconsHelper.icon(icon, { fontSize: 18, lineHeight: "25px" }) }
        </div>
        <div className="info-row-text">
          <p>{ content }</p>
        </div>
      </div>
    );
};

const OwnerActions = ({ self }) => (
  <div>
    <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
      <Link className="button" to={ "/my-giveaways/" + ga._id }>
        <FlatButton label="Edit" />
      </Link>
    </div>
  </div>
);

const NonOwnerActions = ({ self }) => {
  const userHasFlagged = GiveawaysHelper.userHasFlagged(ga, Meteor.user());

  return (
    <div>
      { userHasFlagged ?
        <p className="small-text">
          <em>You have flagged this giveaway for moderators' attention. We will be reviewing this giveaway shortly.</em>
        </p> : null }

      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
        { Meteor.userId() && ga.userId !== Meteor.userId() && !userHasFlagged ?
          <FlatButton label="Flag" onTouchTap={ event => self.setState({ confirmFlagDialogOpen: true }) } />
          : null }
      </div>
    </div>
  );
};

const ModActions = ({ self }) => {
  const countFlags = GiveawaysHelper.countTotalFlags(ga);
  const isRemoved = ga.isRemoved;

  const FlagCounts = () => (
    <p className="small-text">
      <em>This giveaway has been flagged {countFlags} { pluralizer(countFlags, 'time', 'times') }.</em>
    </p>
  );

  const DeletedBy = () => {
    const deleter = Meteor.users.findOne(ga.removeUserId);

    return (
      <p className="small-text">
        <em>This giveaway was deleted by { UsersHelper.getFullName(deleter) } { moment(ga.removeDate).fromNow() }.</em>
      </p>
    );
  };

  const buttonsIfRemoved = <FlatButton label="Restore" onTouchTap={ event => self.setState({ confirmRestoreDialogOpen: true }) } />;

  const buttonsIfNotRemoved = [
    <Link className="button" to={ "/my-giveaways/" + ga._id }><FlatButton label="Edit" /></Link>
  ];

  if (countFlags > 0) {
    buttonsIfNotRemoved.push(<FlatButton label="Unflag" onTouchTap={ event => handleAction(unflagGiveaway, ga._id, 'Successfully removed all flags.') } />);
    buttonsIfNotRemoved.push(<FlatButton label="Delete" onTouchTap={ event => self.setState({ confirmRemoveDialogOpen: true }) } />);
  }

  return (
    <div>
      { isRemoved ? <DeletedBy /> : countFlags > 0 ? <FlagCounts /> : null }

      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
        { isRemoved ? buttonsIfRemoved : buttonsIfNotRemoved }
      </div>
    </div>
  );
};

const ConfirmFlagDialog = ({ open, handleSubmit, handleClose }) => (
  <ConfirmDialog
    title="Flag Giveaway"
    open={ open }
    handleClose={ handleClose }
    handleSubmit={ handleSubmit }>

    <p>You can bring this giveaway to a moderator's attention by flagging it. Flagging a giveaway is usually done for the following reasons:</p>

    <ul>
      <li><strong>Spam/Fakes</strong>: Giveaway does not exist and should be removed from the site.</li>
      <li><strong>Abusive</strong>: Giveaway contains abusive content and should be removed.</li>
      <li><strong>Duplicate</strong>: This giveaway is a duplicate of another one, and content should be merged.</li>
    </ul>

    <p>Do leave a comment on the reason for flagging this giveaway.</p>

    <br />

    <p style={{ color: Colors.red900 }}>Please confirm if you would like to flag this giveaway by clicking <strong>Submit</strong>.</p>

  </ConfirmDialog>
);

const ConfirmRestoreDialog = ({ open, handleSubmit, handleClose }) => (
  <ConfirmDialog
    title="Restore this giveaway?"
    open={ open }
    handleClose={ handleClose }
    handleSubmit={ handleSubmit }>

    <p>Are you sure you wish to restore this giveaway from deletion?</p>

  </ConfirmDialog>
);

const handleAction = (action, _id, notification) => {
  const userId = Meteor.userId();

  if (!_id)
    return false;

  action.call({ _id, userId }, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert(notification, 'success');
    }
  });
};

export class GiveawaySingleCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmFlagDialogOpen: false,
      confirmRemoveDialogOpen: false,
      confirmRestoreDialogOpen: false,
    };
  }

  handleFlagGiveaway(event) {
    this.setState({ confirmFlagDialogOpen: false });
    handleAction(flagGiveaway, this.props.ga._id, 'Thanks for flagging, we will be reviewing this shortly.');
  }

  handleRemoveFlaggedGiveaway(event) {
    this.setState({ confirmRemoveDialogOpen: false });
    handleAction(removeFlaggedGiveaway, this.props.ga._id, 'Removed flagged giveaway.');
  }

  handleRestoreGiveaway(event) {
    this.setState({ confirmRestoreDialogOpen: false });
    handleAction(restoreGiveaway, this.props.ga._id, 'Successfully restored giveaway.');
  }

  render() {
    ga = this.props.ga;

    return (
      <PaperCard className="giveaway giveaway-single">
        <div className="flex-row">
          <div className="col col-xs-12 col-sm-3">
            <div className="avatar">
              { GiveawaysHelper.makeAvatarLegacy(ga, 350) }
            </div>
          </div>
          <div className="col col-xs-12 col-sm-9">
            <h3 className="title">{ ga.title }</h3>
            <h5 className="category">{ GiveawaysHelper.categoryBreadcrumbs(ga) }</h5>
            <p className="description">{ GiveawaysHelper.description(ga) }</p>

            { iconRow("date_range", GiveawaysHelper.dateRange(ga)) }
            { iconRow("location_on", ga.location ) }
            { GiveawaysHelper.is_ongoing(ga) ? iconRow("info_outline", "Status: " + GiveawaysHelper.getLastOwnerStatusType(ga).label ) : null }
            { iconRow("link", makeLink(ga.website, "Website")) }

            { RolesHelper.modsOrAdmins(Meteor.user()) ? <ModActions self={this} /> :
              GiveawaysHelper.isCurrentUserOwner(ga)  ? <OwnerActions self={this} /> : <NonOwnerActions self={this} /> }

          </div>
        </div>

        <ConfirmFlagDialog
          open={ this.state.confirmFlagDialogOpen }
          handleClose={ event => this.setState({ confirmFlagDialogOpen: false }) }
          handleSubmit={ this.handleFlagGiveaway.bind(this) } />

        <RemoveGiveawayDialog
          open={ this.state.confirmRemoveDialogOpen }
          handleClose={ event => this.setState({ confirmRemoveDialogOpen: false }) }
          handleSubmit={ this.handleRemoveFlaggedGiveaway.bind(this) } />

        <ConfirmRestoreDialog
          open={ this.state.confirmRestoreDialogOpen }
          handleClose={ event => this.setState({ confirmRestoreDialogOpen: false }) }
          handleSubmit={ this.handleRestoreGiveaway.bind(this) } />
      </PaperCard>
    );
  }
}
