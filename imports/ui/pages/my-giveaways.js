import { Meteor } from 'meteor/meteor';
import React from 'react';
import { browserHistory } from 'react-router';
import MuiTheme from '../layouts/mui-theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import ConfirmRGeo from '../components/map/confirm-rgeo';
import LeafletMap from '../components/map/leaflet-map';
import MapInfoBox from '../components/map/map-info-box';
import MapUserBox from '../components/map/map-user-box';
import GoToGeolocationButton from '../components/map/go-to-geolocation-button';
import InsertBtnDialog from '../components/map/insert-button-dialog';

import * as LatLngHelper from '../../util/latlng';
import * as IconsHelper from '../../util/icons';

import { Giveaways } from '../../api/giveaways/giveaways';

export class MyGiveaways extends React.Component {
  constructor(props) {
    super(props);
    const self = this;

    this.state = {
      // Properties
      gaSelected: null,
      infoBoxState: 0,
      nearbyBoxState: 1,
      geolocation: null,
      mapCenter: null,
      mapZoom: null,
      mapMaxZoom: null,
      isModalOpen: false,
      latLngClicked: {lat:"",lng:""},
      locArr: [],
      showRGeoMarker: false,
      showMarkers: true,
      rGeoLoading: false,
      rGeoTrigger: false,
      gaEdit: null,
      gaId: null,
      showDateRange: false,
      paramId: null,
    };

    this.userUntilDate = new ReactiveVar( moment().set('hour', 0).set('minute',0).add(1,'w').toDate() );
    this.userFromDate = new ReactiveVar( moment().set('hour', 0).set('minute',0).toDate() );
    this.isAllGa = new ReactiveVar( true );

    this.mapBounds = new ReactiveVar( null );

    this.subscription = null;
    this.autorunSub = null;
    this.autorunGeo = null;
    this.autorunAuth = null;

    this.openInsertDialog = this.openInsertDialog.bind(this);
  }

  selectGa(gaId) {
    this.setState({
      gaSelected: gaId,
      infoBoxState: 1,  // Bottom bar: peek title / Sidebar: show
    });
  }

  setInfoBoxState(x) {
    this.setState({ infoBoxState: x });
    if (!x) this.setState({ gaSelected: null });
  }

  setNearbyBoxState(x) {
    this.setState({ nearbyBoxState: x });
  }

  componentDidMount() {
    const self = this;
    this.autorunSub = Tracker.autorun(function () {
      // const reactiveDateTime = Chronos.currentTime(Meteor.settings.public.refresh_interval || 60000);
      // const reactiveMapBounds = self.mapBounds.get();
      const userFromDate = self.userFromDate.get();
      const userUntilDate = self.userUntilDate.get();
      const isAllGa = self.isAllGa.get();
      // trigger ui update
      self.setState({showDateRange: self.state.showDateRange});

      // Re-subscribe when date range changes
      if (userFromDate && userUntilDate) {
        self.subscription = Meteor.subscribe('user-giveaways-within-date', userFromDate, userUntilDate, isAllGa);
      }
    });

    this.autorunGeo = Tracker.autorun(function() {
      const reactiveLatLng = Geolocation.latLng();
      // Set current location
      self.setState({ geolocation: reactiveLatLng });
    });

    if (this.props.params.id)
      Meteor.subscribe('giveaway-by-id', this.props.params.id, function() {
        self.handleParams();
      });
  }

  componentDidUpdate() {
    this.handleParams();
  }

  componentWillUnmount() {
    this.subscription && this.subscription.stop();
    this.autorunSub && this.autorunSub.stop();
    this.autorunGeo && this.autorunGeo.stop();
  }

  handleParams() {
    const self = this;
    const paramId = this.props.params.id;

    if (this.state.paramId != paramId) {
      this.setState({ paramId }, () => {
        if (paramId) {
          const giveaway = Giveaways.findOne(paramId);
          const handler = self.selectEditGa(giveaway);
          handler();
        } else {
          (self.selectEditGa(null))();
        }
      });
    }
  }

  goToGeolocation() {
    this.setState({ mapCenter: this.state.geolocation });
  }

  showMarkers() {
    this.setState({ showMarkers: true });
  }

  hideMarkers() {
    this.setState({ showMarkers: false });
  }

  resetLoc() {
    this.setState({
      latLngClicked: {lat:"",lng:""},
      locArr: [],
      locName: "",
    })
  }

  handleUserUntilDate(event, date){
    this.userUntilDate.set(moment(date).add(23,'h').add(59,'m').toDate());
  }
  handleUserFromDate(event, date){
    this.userFromDate.set(date);
  }

  handleAllUserGiveaways(){
    this.setState({ showDateRange: !this.state.showDateRange });
    this.isAllGa.set(!this.isAllGa.get());
  }
  openInsertDialog() {
    this.setState({ isModalOpen: true, showRGeoMarker: false })
    this.rmvRGeoListener && this.rmvRGeoListener();
    this.showMarkers();
  }

  setConfirmDialog(features, coords, rmvRGeoListener){
    this.rmvRGeoListener = rmvRGeoListener;

    let locArr = features.map((loc)=> {
      loc.text = loc.place_name;
      loc.value = loc.place_name;
      return loc;
    });

    this.setState({
      locArr,
      latLngClicked: coords
    });
  }

  selectEditGa(ga) {
    const self = this;

    return event => {
      self.setState({ isModalOpen: ga ? true : false, gaEdit: ga }, () => {
        if (ga)
          browserHistory.push(`/my-giveaways/${ga._id}`);
        else
          browserHistory.push(`/my-giveaways`);
      });
    }
  }

  render() {
    const clickNearbyGa = ga => event => {
      this.selectGa(ga._id);
      this.setState({ mapCenter: LatLngHelper.lnglat2latlng(ga.coordinates) });
      this.setState({ mapZoom: this.state.mapMaxZoom });
    };

    return (
      <div className="full-container">
        <LeafletMap
          gaId={ this.state.gaSelected }
          infoBoxState={ this.state.infoBoxState }
          markerOnClick={ gaId => this.selectGa(gaId) }
          mapCenter={ this.state.mapCenter }
          setMapCenter={ mapCenter => this.setState({ mapCenter }) }
          mapZoom={ this.state.mapZoom }
          setMapZoom={ mapZoom => this.setState({ mapZoom })}
          setMapMaxZoom={ mapMaxZoom => this.setState({ mapMaxZoom })}
          setBounds={ bounds => this.mapBounds.set(bounds) }
          showMarkers={ this.state.showMarkers }
          rGeoTrigger={ this.state.rGeoTrigger }
          rmvRGeoTrigger={ ()=>{this.setState({ rGeoTrigger: false })} }
          addRGeoSpinner={ ()=>{this.setState({ rGeoLoading: true })} }
          rmvRGeoSpinner={ ()=>{this.setState({ rGeoLoading: false })} }
          setConfirmDialog={this.setConfirmDialog.bind(this) }
        />
        <div className="rGeoLoader">
          <RefreshIndicator
            size={40}
            top={10}
            left={ $(window).width() / 2 }
            status={ this.state.rGeoLoading ? "loading" : "hide" }
          />
        </div>
        <div id="map-boxes-container">
          <MapInfoBox
            gaId={ this.state.gaSelected }
            boxState={ this.state.infoBoxState }
            setBoxState={ this.setInfoBoxState.bind(this) } />
          <MapUserBox
            gaId={ this.state.gaSelected }
            boxState={ this.state.nearbyBoxState }
            setBoxState={ this.setNearbyBoxState.bind(this) }
            mapBounds={ this.mapBounds.get() }
            nearbyOnClick={ clickNearbyGa }
            userUntilDate={ this.userUntilDate.get() }
            userFromDate={ this.userFromDate.get() }
            handleUserUntilDate={ this.handleUserUntilDate.bind(this) }
            handleUserFromDate={ this.handleUserFromDate.bind(this) }
            handleAllUserGiveaways={ this.handleAllUserGiveaways.bind(this) }
            editGa={ this.selectEditGa.bind(this) }
            showDateRange={ this.state.showDateRange } />
          { this.state.showRGeoMarker &&
            <ConfirmRGeo
              locArr={ this.state.locArr }
              openInsertDialog={ this.openInsertDialog } />
          }

        </div>

        { this.state.showRGeoMarker && <div className="centerMarker" /> }

        <div id="map-floating-buttons"
             style={{ right: 20 + (this.state.nearbyBoxState > 0 ? $("#map-nearby-box").outerWidth() : 0) }}>
          <GoToGeolocationButton geolocationOnClick={ this.goToGeolocation.bind(this) } />
        </div>

        <InsertBtnDialog
          isModalOpen={ this.state.isModalOpen }
          hideModal={ ()=> this.setState({ isModalOpen: false }) }
          closeModal={ (this.selectEditGa.bind(this))(null) }
          latLng={ this.state.latLngClicked }
          locArr={ this.state.locArr }
          addRGeoTriggerMarker={ ()=> this.setState({ rGeoTrigger: true, showRGeoMarker: true }) }
          hideMarkers={ this.hideMarkers.bind(this) }
          resetLoc={ this.resetLoc.bind(this) }
          mapCenter={ this.state.mapCenter }
          zoom={ this.state.mapZoom }
          gaEdit={ this.state.gaEdit }
          gaId={ this.state.gaSelected } />

      </div>

    );
  }
}

MyGiveaways.propTypes = {
  name: React.PropTypes.string,
};
