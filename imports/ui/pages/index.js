import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppNavigation from '../components/menu/app-navigation';
import LeafletMap from '../components/map/leaflet-map';

export const Index = () => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <div id="main">
      <AppNavigation />
      <LeafletMap />
    </div>
  </MuiThemeProvider>
);
