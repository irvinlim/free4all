import React from 'react';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';

import * as Helper from '../../../util/helper';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as IconsHelper from '../../../util/icons';
import * as UsersHelper from '../../../util/users';

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

const statusTypeActionRow = (count) => (statusType, index) => (
  <div className={ "col col-xs-12 col-sm-" + 12/count } key={index}>
    <FlatButton
      label={ statusType.label }
      backgroundColor={ statusType.hexColour }
      hoverColor={ Helper.shadeColor(statusType.hexColour, -0.2) }
      labelStyle={{ fontSize: "13px", textTransform: "none", color: "#fff", padding: 5 }}
      style={{ width: "calc(100% - 10px)", margin: "0 auto 5px" }} />
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

const ContributeUpdate = ({ statusTypes }) => (
  <div className="contribute-update">
    <Subheader>Contribute a status update</Subheader>
    <div className="status-updates-actions">
      <div className="flex-row nopad">
        { statusTypes.map(statusTypeActionRow(statusTypes.count())) }
      </div>
    </div>
  </div>
);

const AllUpdates = ({ statusUpdates, owner }) => (
  <div className="all-updates">
    <Subheader>All status updates</Subheader>
    <div className="status-updates-list">
      { statusUpdates.map(statusUpdateRow(owner)) }
    </div>
  </div>
);

export const GiveawayStatusUpdatesCard = ({ ga, statusUpdates, statusTypes, latestOwnerUpdate, owner }) => (
  <Paper className="giveaway giveaway-card">
    <div className="flex-row">
      <div className="col col-xs-12">
        <h3>Status Updates</h3>

        { LatestUpdate({ latestOwnerUpdate, owner }) }

        { GiveawaysHelper.is_ongoing(ga) ? ContributeUpdate({ statusTypes }) : null }

        { AllUpdates({ statusUpdates, owner }) }

      </div>
    </div>
  </Paper>
);
