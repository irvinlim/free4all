import * as Helper from '../../../modules/helper';

import { Categories } from '../../../api/categories/categories';
import { StatusTypes } from '../../../api/status-types/status-types';
import { StatusUpdates } from '../../../api/status-updates/status-updates';

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
  }

  addMarker(id, ga, clickHandler) {
    if (!id)
      return Helper.error("addMarker: No id specified.");

    const status = StatusUpdates.findOne({ userId: ga.userId, giveawayId: ga._id }, { sort: { date: "desc" } });
    Helper.errorIf(!status, "Error: No status update for Giveaway #" + id);
    const statusType = StatusTypes.findOne(status.statusTypeId);
    Helper.errorIf(!statusType, "Error: No status type for Status Update #" + status._id);
    const category = Categories.findOne(ga.categoryId);
    Helper.errorIf(!category, "Error: No category defined for Giveaway #" + id);

    let css = {};
    if (!Helper.is_over(ga.startDateTime, ga.endDateTime))
      css = { 'background-color': Helper.sanitizeHexColour(statusType.hexColour) };

    const icon = this.markerIcon("map-marker", css, { "ga-id": id }, '<i class="' + category.iconClass + '"></i>');

    Helper.warnIf(this.markers[id], "Notice: Duplicate marker IDs present.");

    this.markers[id] = L.marker(this.latlng(ga.coordinates), {icon: icon}).on('click', this.markerOnClick(ga, clickHandler));

    this.markerClusterGroup.addLayer(this.markers[id]);
  }

  removeMarker(id, ga, clickHandler) {
    Helper.errorIf(!this.markers[id], "Error: No such marker for Giveaway #" + id);

    this.markers[id].off('click');
    this.map.removeLayer(this.markers[id]);
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
      html: $icon[0].outerHTML,
    });
  }

  markerOnClick(ga, callback) {
    return (event) => {
      if (callback)
        callback(ga._id);

      $(".map-marker").removeClass("selected");

      if (ga)
        $(".map-marker[ga-id="+ga._id+"]").addClass('selected');
    };
  }

  latlng(lnglat) {
    return [lnglat[1], lnglat[0]];
  }
}
