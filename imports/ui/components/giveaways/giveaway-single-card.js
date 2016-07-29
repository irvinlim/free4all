import { Meteor } from 'meteor/meteor';
import React from 'react';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import PaperCard from '../../layouts/paper-card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { Link } from 'react-router';

import * as Colors from 'material-ui/styles/colors';
import * as Helper from '../../../util/helper';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as AvatarHelper from '../../../util/avatar';
import * as IconsHelper from '../../../util/icons';

import { flagGiveaway } from '../../../api/giveaways/methods';

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

const HasFlagged = () => (
  <p className="small-text">
    <em>You have flagged this giveaway for moderators' attention. We will be reviewing this giveaway shortly.</em>
  </p>
);

const ConfirmFlagDialog = ({ open, handleClose, handleSubmit }) => {
  const actions = [
    <FlatButton label="Cancel" onTouchTap={ handleClose } />,
    <FlatButton label="Submit" onTouchTap={ handleSubmit } />,
  ];

  return (
    <Dialog
      title="Flag Giveaway"
      actions={ actions }
      open={ open }
      onRequestClose={ handleClose }>

      <p>You can bring this giveaway to a moderator's attention by flagging it. Flagging a giveaway is usually done for the following reasons:</p>

      <ul>
        <li><strong>Spam/Fakes</strong>: Giveaway does not exist and should be removed from the site.</li>
        <li><strong>Abusive</strong>: Giveaway contains abusive content and should be removed.</li>
        <li><strong>Duplicate</strong>: This giveaway is a duplicate of another one, and content should be merged.</li>
      </ul>

      <p>Do leave a comment on the reason for flagging this giveaway.</p>

      <br />

      <p style={{ color: '#8c2444' }}>Please confirm if you would like to flag this giveaway by clicking <strong>Submit</strong>.</p>

    </Dialog>
  );
};

export class GiveawaySingleCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmFlagDialogOpen: false,
    };
  }

  handleFlagGiveaway(event) {
    this.setState({ confirmFlagDialogOpen: false });

    flagGiveaway.call({ _id: this.props.ga._id, userId: Meteor.userId() }, function(error) {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Thanks for flagging, we will be reviewing this shortly.', 'success');
      }
    });
  }

  render() {
    const ga = this.props.ga;
    const userHasFlagged = GiveawaysHelper.userHasFlagged(ga, Meteor.user());

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
            { iconRow("link", Helper.makeLink(ga.website, "Website")) }

            { userHasFlagged ? <HasFlagged /> : null }

            <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
              { GiveawaysHelper.isCurrentUserOwner(ga) ?
                <Link className="button" to={ "/my-giveaways/" + ga._id }>
                  <FlatButton label="Edit" />
                </Link> : null
              }

              { Meteor.userId() && ga.userId !== Meteor.userId() && !userHasFlagged ?
                <FlatButton label="Flag" onTouchTap={ event => this.setState({ confirmFlagDialogOpen: true }) } />
                : null
              }
            </div>

          </div>
        </div>

        <ConfirmFlagDialog
          open={ this.state.confirmFlagDialogOpen }
          handleClose={ event => this.setState({ confirmFlagDialogOpen: false }) }
          handleSubmit={ this.handleFlagGiveaway.bind(this) } />
      </PaperCard>
    );
  }
}
