import React from 'react';
import { Row, Col } from 'react-bootstrap';

import * as Helper from '../../../util/helper';
import * as IconsHelper from '../../../util/icons';

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


const getContent = ({ giveaway, latestStatus, latestStatusType, category, parentCategory }) => {
  if (!giveaway) {
    return (
      <em>Select a giveaway to see more information.</em>
    );
  } else {
    return (
      <div>
        <h3 className="single-line">{ giveaway.title }</h3>
        <p className="category">{ parentCategory.name } &mdash; { category.name }</p>
        <p className="description">{ giveaway.description ? Helper.nl2br(giveaway.description) : (<em>No description</em>) }</p>
        { iconRow("date_range", Helper.compact_date_range(giveaway.startDateTime, giveaway.endDateTime)) }
        { iconRow("location_on", giveaway.location ) }
        { Helper.is_ongoing(giveaway.startDateTime, giveaway.endDateTime) ?
            iconRow("info_outline", "Status: " + latestStatusType.label ) :
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
