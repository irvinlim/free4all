import React from 'react';
import { Row, Col } from 'react-bootstrap';

import * as IconsHelper from '../../../util/icons';
import * as AvatarHelper from '../../../util/avatar';
import * as GiveawaysHelper from '../../../util/giveaways';

const iconRow = (icon, content) => {
  if (content && content.length)
    return (
      <div className="map-info-row">
        <div className="info-row-icon">
          { IconsHelper.icon(icon, { fontSize: 18, lineHeight: "25px" }) }
        </div>
        <div className="info-row-text">
          <p>{ content }</p>
        </div>
      </div>
    );
};


const getContent = ({ giveaway }) => {
  if (!giveaway) {
    return (
      <em>Select a giveaway to see more information.</em>
    );
  } else {
    return (
      <div className="giveaway-infobox giveaway">
        { giveaway.avatarId ?
          <div className="photo-avatar">
            <img src={ AvatarHelper.getUrl(giveaway.avatarId, 350) } />
          </div> :
          <div /> }
        <h3 className="lines-1">{ giveaway.title }</h3>
        <p className="category">{ GiveawaysHelper.categoryBreadcrumbs(giveaway) }</p>
        <p className="description">{ GiveawaysHelper.description(giveaway) }</p>
        { iconRow("date_range", GiveawaysHelper.compactDateRange(giveaway.startDateTime, giveaway.endDateTime)) }
        { iconRow("location_on", giveaway.location ) }
        { !GiveawaysHelper.is_over(giveaway) ?
            iconRow("info_outline", "Status: " + GiveawaysHelper.getLastOwnerStatusType(giveaway).label ) :
            iconRow("info_outline", "Status: Ended" ) }
      </div>
    );
  }
};

export const GiveawayInfoboxContent = (props) => (
  <div id="giveaway-infobox-content">
    { getContent(props) }
  </div>
);
