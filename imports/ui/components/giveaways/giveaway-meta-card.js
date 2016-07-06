import React from 'react';
import Paper from 'material-ui/Paper';

import * as UsersHelper from '../../../util/users';

export const GiveawayMetaCard = ({ ga, user, shareCount }) => (
  <Paper className="giveaway giveaway-card">
    <div className="flex-row">
      <div className="col col-xs-12">
        <h3>About the User</h3>
        <div className="flex-row">
          <div className="col col-xs-4 col-sm-3">
            { UsersHelper.getAvatar(user, 64, { margin: "0 auto", display: "block" }) }
          </div>
          <div className="col col-xs-8 col-sm-9">
            <h4 style={{ marginTop: 0 }}>{ UsersHelper.getFullName(user) }</h4>
            <h5>{ shareCount } giveaways shared</h5>
          </div>
        </div>
      </div>
    </div>
  </Paper>
);
