import * as Helper from '../../../util/helper';
import * as LatLngHelper from '../../../util/latlng';
import * as GiveawaysHelper from '../../../util/giveaways';

export default class LeafletMapObject {
  constructor(elemId) {
    const self = this;

    this.markers = {};
    this.markerClusterGroup = new L.markerClusterGroup({
      iconCreateFunction: function(cluster) {
        return self.markerIcon("map-marker cluster-marker", {}, {}, $("<span />").html(cluster.getChildCount()));
      }
    });

    this.makeMap(elemId);
    this.initializeGeolocation();
  }

  makeMap(elemId) {
    // Settings
    Helper.errorIf(!Meteor.settings.public.MapBox, "Error: Mapbox settings not defined.");

    let initialCoords = Meteor.settings.public.MapBox.initialCoords,
        initialZoom = Meteor.settings.public.MapBox.initialZoom,
        mapID = Meteor.settings.public.MapBox.mapID,
        accessToken = Meteor.settings.public.MapBox.accessToken;

    Helper.errorIf(!accessToken, "Error: Mapbox access token not defined.");

    if (!initialCoords) initialCoords = [0, 0];
    if (!initialZoom) initialZoom = 1;
    if (!mapID) mapID = "mapbox.streets";

    // Leaflet map
    this.map = L.map(elemId, { zoomControl:false }).setView(Meteor.settings.public.MapBox.initialCoords, Meteor.settings.public.MapBox.initialZoom);

    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      id: Meteor.settings.public.MapBox.mapID,
      accessToken: Meteor.settings.public.MapBox.accessToken
    }).addTo(this.map);

    this.map.addLayer(this.markerClusterGroup);
    this.map.doubleClickZoom.disable(); 
  }

  addMarker(id, ga, clickHandler) {
    if (!id)
      return Helper.error("addMarker: No id specified.");

    let css = {};
    if (!Helper.is_over(ga.startDateTime, ga.endDateTime))
      css = { 'background-color': GiveawaysHelper.getStatusColor(ga) };

    const icon = this.markerIcon("map-marker", css, { "ga-id": id }, Helper.react2html(GiveawaysHelper.getCategoryIcon(ga)));

    Helper.warnIf(this.markers[id], "Notice: Duplicate marker IDs present.");

    this.markers[id] = L.marker(LatLngHelper.lnglat2latlng(ga.coordinates), {icon: icon}).on('click', this.markerOnClick(ga, clickHandler));

    this.markerClusterGroup.addLayer(this.markers[id]);
  }

  removeMarker(id, ga, clickHandler) {
    Helper.errorIf(!this.markers[id], "Error: No such marker for Giveaway #" + id);

    this.markers[id].off('click');
    this.markerClusterGroup.removeLayer(this.markers[id]);
    this.markers[id] = null;
  }

  updateMarker(id, ga, clickHandler) {
    if (id in this.markers) this.removeMarker(id, ga, clickHandler);
    this.addMarker(id, ga, clickHandler);
  }

  markerIcon(className, css, attr, content) {
    const $icon = $('<div />').addClass(className).css(css).attr(attr).html(content);
    return L.divIcon({
      iconSize: [40, 54],
      iconAnchor: [20, 54],
      html: Helper.jquery2html($icon),
    });
  }

  markerOnClick(ga, callback) {
    return (event) => {
      if (callback)
        callback(ga._id);
    };
  }

  initializeGeolocation() {
    const self = this;

    // Make custom marker
    const divIcon = L.divIcon({
      iconSize: [22, 22],
      html: '<div class="current-location-marker"><div class="pulse"></div></div>',
    });
    this.geolocatedMarker = L.marker([0, 0], {icon: divIcon}).addTo(this.map);

    // Autorun for reactive geolocation
    Tracker.autorun(function () {
      const latlng = Geolocation.latLng();

      if (!latlng)
        return;
      else
        self.geolocatedMarker.setLatLng([latlng.lat, latlng.lng]);
    });
  }

  registerEventHandler(event, callback) {
    const handler = this.map.on(event, callback.bind(this.map));

    return {
      trigger: () => this.map.fire(event),
    };
  }
}
