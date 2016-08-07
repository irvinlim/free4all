import { Meteor } from 'meteor/meteor';
import React from 'react';
import MuiTheme from '../layouts/mui-theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from '../components/header/header';
import LeafletMap from '../components/map/leaflet-map';
import ConfirmRGeo from '../components/map/confirm-rgeo';
import MapInfoBox from '../components/map/map-info-box';
import MapNearbyBox from '../components/map/map-nearby-box';
import SelectHomeDialog from '../components/form/select-home-dialog';
import GoToHomeButton from '../components/form/go-to-home-button';
import InsertBtn from '../components/form/insert-button';
import GoToGeolocationButton from '../components/map/go-to-geolocation-button'
import InsertBtnDialog from '../components/map/insert-button-dialog'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import * as LatLngHelper from '../../util/latlng';
import * as IconsHelper from '../../util/icons';
import { Bert } from 'meteor/themeteorchef:bert';

const isMobile = () => $(window).innerWidth() <= 992;

export class Index extends React.Component {
  constructor(props) {
    super(props);
    const self = this;

    this.state = {
      gaSelected: null,
      infoBoxState: 0,
      nearbyBoxState: 1,
      geolocation: null,
      mapCenter: null,
      mapZoom: null,
      mapMaxZoom: null,
      isModalOpen: false,
      latLngClicked: {lat:"",lng:""},
      locName: "",
      locNameFlag: false,
      locArr: [],
      locAddress: "",
      showRGeoMarker: false,
      showMarkers: true,
      rGeoLoading: false,
      rGeoTrigger: false,
      isHomeLocOpen: false,
      homeLocation: null,
      homeZoom: null,
    };

    this.subscription = null;
    this.autorunSub = null;
    this.autorunGeo = null;
    this.autorunHome = null;
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

    // Autorun subscription
    this.autorunSub = Tracker.autorun(function () {
      const reactiveUser = Meteor.user();

      // Re-subscribe if user changed
      let commIds = [];

      // Pass user communities to publication function
      if (Meteor.user())
        commIds = Meteor.user().communityIds;
      else if (Session.get('homeLocation'))
        commIds = [ Session.get('homeLocation').commId ];

      self.subscription = Meteor.subscribe('giveaways-search', { tab: 'current', commIds });
    });

    // Autorun track device location
    this.autorunGeo = Tracker.autorun(function() {
      const reactiveLatLng = Geolocation.latLng();

      // Set current location
      self.setState({ geolocation: reactiveLatLng });
    })

    // Autorun check user authenticated
    this.autorunAuth = Tracker.autorun(function() {
      const user = Meteor.user();
      if (user && user.profile.homeLocation) {
        const homeLocation = user.profile.homeLocation;
        const homeZoom = user.profile.homeZoom;
        const commId = user.profile.homeCommunityId;
        // homeLocation state is for goToHomeLocation Button
        self.setState({ homeLocation: homeLocation, homeZoom: homeZoom });
        // homeLocation session is for initial map center
        Session.setPersistent('homeLocation', { coordinates: homeLocation, zoom: homeZoom, commId: commId});
      }
    });

    // Autorun home location session variable
    this.autorunHome = Tracker.autorun(function(){
      let homeLoc = Session.get('homeLocation');
      if (homeLoc)
        self.setState({
          homeLocation: homeLoc.coordinates,
          homeZoom: homeLoc.zoom
        });
    });

    // Set initial map center for returning visitor, open dialog if not set
    let homeLoc = Session.get('homeLocation');
    if (homeLoc) {
      self.setState({
        mapCenter: homeLoc.coordinates,
        homeLocation: homeLoc.coordinates,
        mapZoom: isMobile() ? homeLoc.zoom - 1 : homeLoc.zoom
      });
    } else {
      self.setState({ isHomeLocOpen: true });
    }
  }

  componentWillUnmount() {
    this.subscription && this.subscription.stop();
    this.autorunSub && this.autorunSub.stop();
    this.autorunHome && this.autorunHome.stop();
    this.autorunGeo && this.autorunGeo.stop();
    this.autorunAuth && this.autorunAuth.stop();
  }

  goToGeolocation() {
    this.setState({ mapCenter: this.state.geolocation });
  }

  goToHomeLoc(){
    this.setState({
      mapCenter: this.state.homeLocation,
      mapZoom: isMobile() ? this.state.homeZoom - 1 : this.state.homeZoom
    });
  }

  handleOpen() {
    // If not logged in, open login dialog instead
    if (!Meteor.user())
      return Store.dispatch({ type: 'OPEN_LOGIN_DIALOG', message: "Login to contribute a giveaway!" });

    this.setState({
      isModalOpen:true,
      nearbyBoxState: 0,
      infoBoxState: 0
    });
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

    let locationText = locArr[0].text;
    const strSplitIdx = locationText.indexOf(',');
    const locName = locationText.substr(0, strSplitIdx);
    const locAddress = locationText.substr(strSplitIdx + 1);

    this.setState({
      locArr,
      locName,
      locAddress,
      locNameFlag: true,
      latLngClicked: coords
    });
  }

  showMarkers() {
    this.setState({ showMarkers: true });
  }

  resetLoc() {
    this.setState({
      latLngClicked: {lat:"",lng:""},
      locArr: [],
      locName: "",
    });
  }

  setHomeLoc(community){
    this.setState({
      isHomeLocOpen: false,
      mapZoom: isMobile() ? community.zoom - 1: community.zoom,   // Reduce by 1 for mobile
      mapCenter: community.coordinates,
      homeLocation: community.coordinates,
      homeZoom: community.zoom
    });

    Session.setPersistent('homeLocation', {
      coordinates: community.coordinates,
      zoom: community.zoom,
      commId: community._id
    });
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
          setMapZoom={ mapZoom => this.setState({ mapZoom: mapZoom })}
          setMapMaxZoom={ mapMaxZoom => this.setState({ mapMaxZoom: mapMaxZoom })}
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
            setBoxState={ this.setInfoBoxState.bind(this) }
          />
          <MapNearbyBox
            gaId={ this.state.gaSelected }
            boxState={ this.state.nearbyBoxState }
            setBoxState={ this.setNearbyBoxState.bind(this) }
            nearbyOnClick={ clickNearbyGa }
          />
          <ConfirmRGeo
            latLng={ this.state.latLngClicked }
            locArr={ this.state.locArr }
            locAddress={ this.state.locAddress }
            locName={ this.state.locName }
            openInsertDialog={ this.openInsertDialog }
          />
        </div>

        { this.state.showRGeoMarker && <div className="centerMarker" /> }

        <SelectHomeDialog
          isHomeLocOpen={ this.state.isHomeLocOpen }
          closeSelectHomeModal={ () => this.setState({ isHomeLocOpen: false }) }
          setHomeLoc={this.setHomeLoc.bind(this)} />

        <div id="map-floating-buttons" style={{ right: 20 + (this.state.nearbyBoxState > 0 ? $("#map-nearby-box").outerWidth() : 0) }}>

          <GoToGeolocationButton
            geolocationOnClick={ this.goToGeolocation.bind(this) } />

          <GoToHomeButton
            goToHomeLoc = { this.goToHomeLoc.bind(this) }
            homeLocation = { this.state.homeLocation } />

          <InsertBtn
            handleOpen={ this.handleOpen.bind(this) } />

          <InsertBtnDialog
            isModalOpen={this.state.isModalOpen}
            closeModal={ ()=>{this.setState({ isModalOpen: false })} }
            latLng={this.state.latLngClicked}
            locArr={this.state.locArr}
            locName={this.state.locName}
            locNameFlag={this.state.locNameFlag}
            rmvlocNameFlag={ ()=>{this.setState({ locName: null, locNameFlag: false })} }
            addRGeoTriggerMarker={ ()=>{this.setState({ rGeoTrigger: true, showRGeoMarker: true })} }
            hideMarkers={ ()=>{this.setState({ showMarkers: false })} }
            resetLoc={ this.resetLoc.bind(this) }
            mapCenter={ this.state.mapCenter }
            zoom={ this.state.mapZoom } />

        </div>
      </div>
    );
  }
}

Index.propTypes = {
  name: React.PropTypes.string,
};
