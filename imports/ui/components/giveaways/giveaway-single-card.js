import React from 'react';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';

import * as Colors from 'material-ui/styles/colors';
import * as Helper from '../../../util/helper';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as AvatarHelper from '../../../util/avatar';
import * as IconsHelper from '../../../util/icons';

const iconRow = (icon, content) => {
  if (content && content.length)
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

export const GiveawaySingleCard = ({ ga }) => (
  <Paper className="giveaway giveaway-single giveaway-card">
    <div className="flex-row">
      <div className="col col-xs-12 col-sm-3">
        { GiveawaysHelper.makeAvatar(ga, 700) }
      </div>
      <div className="col col-xs-12 col-sm-9">
        <h3 className="title">{ ga.title }</h3>
        <h5 className="category">{ GiveawaysHelper.categoryBreadcrumbs(ga) }</h5>
        <p className="description">{ GiveawaysHelper.description(ga) }</p>

        { iconRow("date_range", GiveawaysHelper.dateRange(ga)) }
        { iconRow("location_on", ga.location ) }
        { !GiveawaysHelper.is_over(ga) ?
            iconRow("info_outline", "Status: " + GiveawaysHelper.getLastOwnerStatusType(ga).label ) :
            iconRow("info_outline", "Status: Ended" ) }
      </div>
    </div>
  </Paper>
);
