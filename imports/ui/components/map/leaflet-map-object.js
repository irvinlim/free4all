import React from 'react';
import { Meteor } from 'meteor/meteor';
import { sanitizeHexColour, sanitizeStringSlug } from '../../../modules/string-helper';

export default class LeafletMapObject {
  constructor(elemID) {
    if (!Meteor.settings.public.MapBox)
      throw Error("Mapbox settings not defined.");

    let initialCoords = Meteor.settings.public.MapBox.initialCoords,
        initialZoom = Meteor.settings.public.MapBox.initialZoom,
        mapID = Meteor.settings.public.MapBox.mapID,
        accessToken = Meteor.settings.public.MapBox.accessToken;

    if (!accessToken)
      throw Error("Mapbox access token not defined.");

    if (!initialCoords)
      initialCoords = [0, 0];

    if (!initialZoom)
      initialZoom = 1;

    if (!mapID)
      mapID = "mapbox.streets";

    this.map = L.map(elemID, {}).setView(Meteor.settings.public.MapBox.initialCoords, Meteor.settings.public.MapBox.initialZoom);
    this.markers = {};

    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      id: Meteor.settings.public.MapBox.mapID,
      accessToken: Meteor.settings.public.MapBox.accessToken
    }).addTo(this.map);
  }

  addMarker(id, props, clickHandler) {
    const markerReact = (
      <div id="map-marker" style={ { backgroundColor: sanitizeHexColour(props.status[0].hexColour) } }>
        <FontIcon className="material-icons">{ sanitizeStringSlug(props.category.icon) }</FontIcon>
      </div>
    );

    const icon = L.divIcon({
      html: React.renderToString(markerReact),
    });

    if (this.markers[id])
      console.warn("Notice: Duplicate marker IDs present.");

    this.markers[id] = L.marker(props.coordinates, {icon: icon});
    this.markers[id].addTo(this.map).on('click', clickHandler);
  }

  removeMarker(id) {
    this.markers[id].unbind('click');
    this.map.removeLayer(this.markers[id]);
    this.markers[id] = null;
  }
}
