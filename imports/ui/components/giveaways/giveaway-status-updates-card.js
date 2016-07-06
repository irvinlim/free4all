import React from 'react';
import Paper from 'material-ui/Paper';

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

export const GiveawayStatusUpdatesCard = ({ statusUpdates, owner }) => (
  <Paper className="giveaway giveaway-card">
    <div className="flex-row">
      <div className="col col-xs-12">
        <h3>Status Updates</h3>
        <div className="status-updates-list">
          { statusUpdates.map(statusUpdateRow(owner)) }
        </div>
      </div>
    </div>
  </Paper>
);
