import { Meteor } from 'meteor/meteor';
import React from 'react';
import MuiTheme from '../layouts/mui-theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from '../components/header/header';
import LeafletMap from '../components/map/leaflet-map';

import MapInfoBox from '../components/map/map-info-box';
import MapUserBox from '../components/map/map-user-box';

import { GoToGeolocationButton } from '../components/map/go-to-geolocation-button'
import InsertBtnDialog from '../components/map/insert-button-dialog'
import EditBtnDialog from '../components/map/edit-button-dialog'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import * as LatLngHelper from '../../util/latlng';
import * as IconsHelper from '../../util/icons';
import { Bert } from 'meteor/themeteorchef:bert';

export class MyCommunities extends React.Component {
  constructor(props) {
    super(props);
    const self = this;

    this.state = {


    };

  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }


  render() {

    return (
      <div className="full-container">

      </div>

    );
  }
}

MyCommunities.propTypes = {
  name: React.PropTypes.string,
};
