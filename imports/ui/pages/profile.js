import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid } from 'react-bootstrap';
import PaperCard from '../layouts/paper-card';

import ProfileHeader from '../containers/profile/profile-header';
import LeafletMap from '../components/map/leaflet-map';

import * as LatLngHelper from '../../util/latlng';
import * as IconsHelper from '../../util/icons';
import MapInfoBox from '../components/map/map-info-box';

export class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Properties
      gaSelected: null,
      infoBoxState: 0,
      mapCenter: null,
      mapZoom: null,
      mapMaxZoom: null,
      isModalOpen: false,
      latLngClicked: { lat: "", lng: "" },
      locName: "",
      locArr: [],
      isDraggableAdded: false,
      showMarkers: true,
      rGeoLoading: false,
    };

    this.mapBounds = new ReactiveVar( null );
    this.autorunGeo = null;
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

  goToGeolocation() {
    this.setState({ mapCenter: this.state.geolocation });
  }

  componentDidMount() {
    const self = this;

    this.autorunGeo = Tracker.autorun(function() {
      const reactiveLatLng = Geolocation.latLng();
      self.setState({ geolocation: reactiveLatLng });
    });

    this.windowResizeHandler = (event) => {
      setTimeout(() => {
        const h = window.innerHeight - $("#header").outerHeight() - $(".profile-header").outerHeight(true)
                  - parseInt($("#page-profile").css('padding-top')) - 10;
        $(".profile-map").css('height', h);
      }, 1000);
    };

    $(window).on('resize', this.windowResizeHandler).resize();
  }

  componentWillUnmount() {
    this.autorunGeo && this.autorunGeo.stop();
    $(window).off('resize', this.windowResizeHandler);
  }

  render() {
    return (
      <div id="page-profile" className="page-container" style={{ overflow: "hidden" }}>
        <Grid>
          <div className="flex-row nopad">
            <div className="col col-xs-12">
              <PaperCard className="profile">
                <div className="profile">
                  <ProfileHeader userId={ this.props.params.userId ? this.props.params.userId : Meteor.userId() } />

                  <div className="profile-map">
                    <LeafletMap
                      gaId={ this.state.gaSelected }
                      infoBoxState={ this.state.infoBoxState }
                      markerOnClick={ gaId => this.selectGa(gaId) }
                      mapCenter={ this.state.mapCenter }
                      setMapCenter={ mapCenter => this.setState({ mapCenter }) }
                      mapZoom={ this.state.mapZoom }
                      setMapZoom={ mapZoom => this.setState({ mapZoom: mapZoom })}
                      setMapMaxZoom={ mapMaxZoom => this.setState({ mapMaxZoom: mapMaxZoom })}
                      setBounds={ bounds => this.mapBounds.set(bounds) }
                      showMarkers={ true }
                      addRGeoSpinner={ ()=>{this.setState({ rGeoLoading: true })} }
                      rmvRGeoSpinner={ ()=>{this.setState({ rGeoLoading: false })} }
                      isDbClickDisabled= { false } />

                    <div id="map-boxes-container">
                      <MapInfoBox
                        gaId={ this.state.gaSelected }
                        boxState={ this.state.infoBoxState }
                        setBoxState={ this.setInfoBoxState.bind(this) } />
                    </div>
                  </div>

                </div>
              </PaperCard>
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}
