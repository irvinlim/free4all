import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class LeafletMap extends React.Component {
  render() {
    return (
      <div className="full-container">
        <div id="main-map"></div>
      </div>
    );
  }

  setContainerSize() {
    $(window).resize(function() {
      $('.full-container').css('height', window.innerHeight - $("#app-navigation").outerHeight());
    });

    $(window).resize();
  }

  makeMap() {
    const map = L.map('main-map', {
      doubleClickZoom: false
    }).setView(Meteor.settings.public.MapBox.initialCoords, Meteor.settings.public.MapBox.initialZoom);

    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      id: Meteor.settings.public.MapBox.mapID,
      accessToken: Meteor.settings.public.MapBox.accessToken
    }).addTo(map);

    return map;
  }

  componentDidMount() {
    this.setContainerSize();

    const map = this.makeMap();

    // map.on('dblclick', function(event) {
    //   Markers.insert({latlng: event.latlng});
    // });

    // var query = Markers.find();
    // query.observe({
    //   added: function (document) {
    //     var marker = L.marker(document.latlng).addTo(map)
    //       .on('click', function(event) {
    //         map.removeLayer(marker);
    //         Markers.remove({_id: document._id});
    //       });
    //   },
    //   removed: function (oldDocument) {
    //     layers = map._layers;
    //     var key, val;
    //     for (key in layers) {
    //       val = layers[key];
    //       if (val._latlng) {
    //         if (val._latlng.lat === oldDocument.latlng.lat && val._latlng.lng === oldDocument.latlng.lng) {
    //           map.removeLayer(val);
    //         }
    //       }
    //     }
    //   }
    // });
  }
}
