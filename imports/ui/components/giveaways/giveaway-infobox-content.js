import React from 'react';
import { Row, Col } from 'react-bootstrap';

import * as IconsHelper from '../../../util/icons';
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
  console.log(giveaway)
  if (!giveaway) {
    return (
      <em>Select a giveaway to see more information.</em>
    );
  } else if(!giveaway.imgUrl){
    return (
      <div className="giveaway">
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
  } else {
    return (
      <div className="giveaway">
        <h3 className="lines-1">{ giveaway.title }</h3>
        <p className="category">{ GiveawaysHelper.categoryBreadcrumbs(giveaway) }</p>
        <p className="description">{ GiveawaysHelper.description(giveaway) }</p>
        { iconRow("date_range", GiveawaysHelper.compactDateRange(giveaway.startDateTime, giveaway.endDateTime)) }
        { iconRow("location_on", giveaway.location ) }
        { !GiveawaysHelper.is_over(giveaway) ?
            iconRow("info_outline", "Status: " + GiveawaysHelper.getLastOwnerStatusType(giveaway).label ) :
            iconRow("info_outline", "Status: Ended" ) }
        <img style={{width:"100%"}} src={ giveaway.imgUrl } />
      </div>
    )
  }
};

export const GiveawayInfoboxContent = (props) => (
  <div id="giveaway-infobox-content">
    { getContent(props) }
  </div>
);
