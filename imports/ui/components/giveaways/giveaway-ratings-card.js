import React from 'react';
import Paper from 'material-ui/Paper';

import GiveawayRatings from '../../containers/giveaways/giveaway-ratings';

export const GiveawayRatingsCard = ({ ga }) => (
  <Paper className="giveaway giveaway-card">
    <div className="flex-row">
      <div className="col col-xs-12">
        <h3>User Ratings</h3>
        <GiveawayRatings gaId={ ga._id } />
      </div>
    </div>
  </Paper>
);
