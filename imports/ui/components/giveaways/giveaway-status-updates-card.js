import React from 'react';
import { Meteor } from 'meteor/meteor';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import { Scrollbars } from 'react-custom-scrollbars';

import * as Helper from '../../../util/helper';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as IconsHelper from '../../../util/icons';
import * as UsersHelper from '../../../util/users';

import { pushStatusUpdate } from '../../../api/giveaways/methods';

const statusUpdateRow = (owner) => (su, index) => (
  <div className="status-update-row" key={index}>
    <span className="orb">
    { IconsHelper.materialIcon("lens", { color: su.statusType.hexColour, fontSize: 10 }) }
    </span>
    <span className="desc">
      { UsersHelper.getFullNameWithLabelIfEqual(su.user, owner, "author") } marked this giveaway as { su.statusType.label }.
      <span className="timestamp small-text">{ moment(su.date).fromNow() }</span>
    </span>
  </div>
);

const statusTypeActionHandler = (giveawayId, statusTypeId) => (event) => {
  if (!Meteor.userId())
    return;

  pushStatusUpdate.call({ giveawayId, statusTypeId, userId: Meteor.userId() });
};

const statusTypeActionRow = (count, ga) => (statusType, index) => (
  <div className={ "col col-xs-12 col-sm-" + 12/count } key={index}>
    <FlatButton
      label={ statusType.label }
      backgroundColor={ statusType.hexColour }
      hoverColor={ Helper.shadeColor(statusType.hexColour, -0.2) }
      labelStyle={{ fontSize: "13px", textTransform: "none", color: "#fff", padding: 5 }}
      style={{ width: "calc(100% - 10px)", margin: "0 auto 5px" }}
      onTouchTap={ statusTypeActionHandler(ga._id, statusType._id) } />
  </div>
);

const LatestUpdate = ({ latestOwnerUpdate, owner }) => (
  <div className="latest-update">
    <Subheader>Latest update from author</Subheader>
    <div className="status-updates-list">
      { (statusUpdateRow(owner))(latestOwnerUpdate) }
    </div>
  </div>
);

const ContributeUpdate = ({ statusTypes, ga }) => (
  <div className="contribute-update">
    <Subheader>Contribute a status update</Subheader>
    <div className="status-updates-actions">
      <div className="flex-row nopad">
        { statusTypes.map(statusTypeActionRow(statusTypes.count(), ga)) }
      </div>
    </div>
  </div>
);

const AllUpdates = ({ statusUpdates, owner }) => (
  <div className="all-updates">
    <Subheader>All status updates</Subheader>
    <div className="status-updates-list">
      <Scrollbars
        autoHide
        autoHeight
        autoHeightMin={22}
        autoHeightMax={150}>
        { statusUpdates.map(statusUpdateRow(owner)) }
      </Scrollbars>
    </div>
  </div>
);

export const GiveawayStatusUpdatesCard = ({ ga, statusUpdates, statusTypes, latestOwnerUpdate, owner }) => (
  <Paper className="giveaway giveaway-card">
    <div className="flex-row">
      <div className="col col-xs-12">
        <h3>Status Updates</h3>

        { LatestUpdate({ latestOwnerUpdate, owner }) }

        { GiveawaysHelper.is_ongoing(ga) ? ContributeUpdate({ statusTypes, ga }) : null }

        { AllUpdates({ statusUpdates, owner }) }

      </div>
    </div>
  </Paper>
);
