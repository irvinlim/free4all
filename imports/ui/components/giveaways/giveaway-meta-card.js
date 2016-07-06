import React from 'react';
import Paper from 'material-ui/Paper';

import * as UsersHelper from '../../../util/users';

export const GiveawayMetaCard = ({ ga, user, shareCount }) => (
  <Paper className="giveaway giveaway-card">
    <div className="flex-row">
      <div className="col col-xs-12">
        <h3>About the User</h3>

        <div style={{ marginTop: 10 }}>
          <div style={{ width: 84, display: "inline-block" }}>
            { UsersHelper.getAvatar(user, 64, { margin: "0 auto", display: "block" }) }
          </div>
          <div style={{ width: "calc(100% - 94px)", marginLeft: 10, display: "inline-block", verticalAlign: "top" }}>
            <h4 style={{ marginTop: 10 }}>{ UsersHelper.getFullName(user) }</h4>
            <h5>{ shareCount } giveaways shared</h5>
          </div>
        </div>

      </div>
    </div>
  </Paper>
);
