import React from 'react';
import Paper from 'material-ui/Paper';
import PaperCard from '../../layouts/paper-card';

import GiveawayRatings from '../../containers/giveaways/giveaway-ratings';

export const GiveawayRatingsCard = ({ ga }) => (
  <PaperCard className="giveaway">
    <div className="flex-row">
      <div className="col col-xs-12">
        <h3>User Ratings</h3>
        <GiveawayRatings gaId={ ga._id } />
      </div>
    </div>
  </PaperCard>
);
