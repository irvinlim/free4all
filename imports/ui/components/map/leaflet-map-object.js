import React from 'react';
import { Meteor } from 'meteor/meteor';
import { sanitizeHexColour, sanitizeStringSlug } from '../../../modules/string-helper';
import * as Helper from '../../../modules/helper';

import FontIcon from 'material-ui/FontIcon';

import { Categories } from '../../../api/categories/categories';
import { StatusTypes } from '../../../api/status-types/status-types';
import { StatusUpdates } from '../../../api/status-updates/status-updates';

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

  addMarker(id, ga, clickHandler) {
    if (!id)
      return Helper.error("addMarker: No id specified.");

    Meteor.subscribe('status-updates-for-giveaway', id);

    const status = StatusUpdates.findOne({ userId: ga.userId }, { sort: { date: "desc" } });
    Helper.errorIf(!status, "Error: No status update for Giveaway #" + id);
    const statusType = StatusTypes.findOne(status.statusTypeId);
    Helper.errorIf(!statusType, "Error: No status type for Status Update #" + status._id);
    const category = Categories.findOne(ga.category);
    Helper.errorIf(!category, "Error: No category defined for Giveaway #" + id);

    const icon = L.divIcon({
      html: '<div class="map-marker" style="background-color: ' + sanitizeHexColour(statusType.hexColour) + '"><i class="' + category.iconClass + '"></i></div>',
    });

    Helper.warnIf(this.markers[id], "Notice: Duplicate marker IDs present.");

    this.markers[id] = L.marker(ga.coordinates, {icon: icon});
    this.markers[id].addTo(this.map).on('click', clickHandler);
  }

  removeMarker(id) {
    Helper.errorIf(!this.markers[id], "Error: No such marker for Giveaway #" + id);

    this.markers[id].unbind('click');
    this.map.removeLayer(this.markers[id]);
    this.markers[id] = null;
  }
}
