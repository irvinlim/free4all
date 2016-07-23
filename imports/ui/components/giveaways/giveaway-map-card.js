import React from 'react';
import Paper from 'material-ui/Paper';

import LeafletMapSingle from '../map/leaflet-map-single';
import * as LatLngHelper from '../../../util/latlng';

export const GiveawayMapCard = ({ ga }) => (
  <Paper className="giveaway giveaway-card">
    <div className="flex-row">
      <div className="col col-xs-12">
        <LeafletMapSingle previewCoords={ LatLngHelper.lnglat2object(ga.coordinates) } previewZoom={17} />
      </div>
    </div>
  </Paper>
);
