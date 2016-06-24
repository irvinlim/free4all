import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import * as Colors from 'material-ui/styles/colors';
import * as IconsHelper from '../../../util/icons';

export const GoToGeolocationButton = (props) => (
  <FloatingActionButton className="geolocation-button" onTouchTap={ props.geolocationOnClick }>
    { IconsHelper.icon("my_location") }
  </FloatingActionButton>
);
