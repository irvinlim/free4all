import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';

import * as Colors from 'material-ui/styles/colors';

export const GoToGeolocationButton = (props) => (
  <FloatingActionButton className="geolocation-button" onTouchTap={ props.geolocationOnClick }>
    <FontIcon className="material-icons">my_location</FontIcon>
  </FloatingActionButton>
);
