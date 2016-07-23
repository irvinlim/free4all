import React from 'react';
import * as Helper from '../../../util/helper';

export default class LeafletMapSingle extends React.Component{
  constructor(props) {
    super(props)

    this.elemId = 'map-single';
    this.marker = null;
    this.map = null;
    this.previewTimeout = null;
  }

  componentDidMount() {
    this.makeMap();
  }

  setView() {
    // Remove old marker if new one selected
    if (this.marker)
      this.map.removeLayer(this.marker);

    // Marker styles
    const css = { 'background-color': "#00bcd4", "font-size": "30px" };
    const iconHTML = '<i class="material-icons">add_location</i>';
    const icon = this.markerIcon("map-marker", css, {}, iconHTML);

    this.marker = L.marker(this.props.previewCoords, { icon: icon, opacity: 1 });
    this.marker.addTo(this.map);

    this.map.setView(this.props.previewCoords, this.props.previewZoom, { animate: true, duration: 1 });
  }

  makeMap() {
    let initialCoords = Meteor.settings.public.MapBox.initialCoords,
        initialZoom = Meteor.settings.public.MapBox.initialZoom,
        mapID = Meteor.settings.public.MapBox.mapID,
        accessToken = Meteor.settings.public.MapBox.accessToken;

    Helper.errorIf(!accessToken, "Error: Mapbox access token not defined.");

    this.map = L.map(this.elemId, { zoomControl: false }).setView(initialCoords, initialZoom);
    this.map.keyboard.disable();

    // Map icon, tile
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      id: mapID,
      accessToken: accessToken
    }).addTo(this.map);

    // Set coordinates
    this.setView();
  }

  markerIcon(className, css, attr, content) {
    const $icon = $('<div />').addClass(className).css(css).attr(attr).html(content);
    return L.divIcon({
      iconSize: [40, 54],
      iconAnchor: [20, 54],
      html: Helper.jquery2html($icon),
    });
  }

  render(){
    return (
      <div id={this.elemId}></div>
    );
  }
}
