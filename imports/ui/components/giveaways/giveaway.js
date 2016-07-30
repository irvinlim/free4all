import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid } from 'react-bootstrap';
import PaperCard from '../../layouts/paper-card';
import Link from '../../layouts/link';

import GiveawaySingleCard from '../../containers/giveaways/giveaway-single-card';
import GiveawayRatingsCard from '../../containers/giveaways/giveaway-ratings-card';
import GiveawayStatusUpdatesCard from '../../containers/giveaways/giveaway-status-updates-card';
import GiveawayCommentsCard from '../../containers/giveaways/giveaway-comments-card';
import GiveawayMetaCard from '../../containers/giveaways/giveaway-meta-card';
import GiveawayMapCard from '../../containers/giveaways/giveaway-map-card';
import GiveawaySharingCard from '../../containers/giveaways/giveaway-sharing-card';

export class Giveaway extends React.Component {
  render() {
    const ga = this.props.ga;

    if (ga)
      return (
        <div className="giveaway">
          <div className="flex-row nopad">
            <div className="col col-xs-12">
              <GiveawaySingleCard gaId={ ga._id } />
            </div>
          </div>
          <div className="flex-row nopad">
            <div className="col col-xs-12 col-sm-6">
              <GiveawayMapCard gaId={ ga._id } />
              <GiveawayRatingsCard gaId={ ga._id } />
              <GiveawayCommentsCard gaId={ ga._id } />
            </div>
            <div className="col col-xs-12 col-sm-6">
              <GiveawayMetaCard gaId={ ga._id } />
              <GiveawaySharingCard gaId={ ga._id } />
              <GiveawayStatusUpdatesCard gaId={ ga._id } />
            </div>
          </div>
        </div>
      );

    else
      return (
        <PaperCard>
          <div className="flex-row">
            <div className="col col-xs-12">
              <h1>No giveaway found.</h1>
              <p>
                <Link to="/">Back to home</Link>
              </p>
            </div>
          </div>
        </PaperCard>
      );
  }
}

