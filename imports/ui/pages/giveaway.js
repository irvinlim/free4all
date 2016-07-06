import { Meteor } from 'meteor/meteor';
import React from 'react';

import { Grid, Row, Col } from 'react-bootstrap';
import GiveawaySingleCard from '../containers/giveaways/giveaway-single-card';
import GiveawayRatingsCard from '../containers/giveaways/giveaway-ratings-card';
import GiveawayStatusUpdatesCard from '../containers/giveaways/giveaway-status-updates-card';
import GiveawayMetaCard from '../containers/giveaways/giveaway-meta-card';
import GiveawaySharingCard from '../containers/giveaways/giveaway-sharing-card';

export class Giveaway extends React.Component {
  render() {
    return (
      <div id="giveaway-single">
        <Grid style={{ marginTop: 20 }}>
          <div className="flex-row nopad">
            <div className="col col-xs-12">
              <GiveawaySingleCard gaId={ this.props.params.id } />
            </div>
          </div>
          <div className="flex-row nopad">
            <div className="col col-xs-12 col-sm-6">
              <GiveawayRatingsCard gaId={ this.props.params.id } />
              <GiveawayStatusUpdatesCard gaId={ this.props.params.id } />
            </div>
            <div className="col col-xs-12 col-sm-6">
              <GiveawayMetaCard gaId={ this.props.params.id } />
              <GiveawaySharingCard gaId={ this.props.params.id } />
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}
