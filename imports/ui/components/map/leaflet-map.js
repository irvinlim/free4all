import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Giveaways } from '../../../api/giveaways/giveaways';
import { StatusUpdates } from '../../../api/status-updates/status-updates';
import LeafletMapObject from './leaflet-map-object';

export default class LeafletMap extends React.Component {
  constructor(props) {
    super(props);

    // Elements in addingMarkers means that the marker is currently
    // being added by the Giveaway added event.
    // This subscribes to status updates for a particular Giveaway,
    // which would trigger StatusUpdate added event.
    // To prevent multiple triggers we have a temporary flag set in addingMarkers.
    this.addingMarkers = {};
  }

  componentDidMount() {
    const self = this;

    this.resizeFullContainer();
    const map = new LeafletMapObject('main-map');
    const clickHandler = (ga) => this.props.markerOnClick(ga);

    // Observe changes in giveaways
    Giveaways.find().observe({
      added: ga => {
        // Set temporary flag.
        self.addingMarkers[ga._id] = true;

        Meteor.subscribe('status-updates-for-giveaway', ga._id, function() {
          // Unset flag once all StatusUpdates have been added.
          delete self.addingMarkers[ga._id];
          map.addMarker(ga._id, ga, clickHandler);
        });
      },
      changed: ga => {
        Meteor.subscribe('status-updates-for-giveaway', ga._id, function() {
          map.updateMarker(ga._id, ga, clickHandler);
        });
      },
      removed: ga => {
        Meteor.subscribe('status-updates-for-giveaway', ga._id, function() {
          map.removeMarker(ga._id, ga, clickHandler);
        });
      },
    });

    // Observe status updates
    StatusUpdates.find().observe({
      added: statusUpdate => {
        const ga = Giveaways.findOne(statusUpdate.giveawayId);

        // Only add markers if the adding flag is not set.
        // These markers are new since page load.
        if (!(ga._id in self.addingMarkers)) {
          map.updateMarker(ga._id, ga, clickHandler);
        }
      },
    });
  }

  render() {
    return (
      <div id="main-map"></div>
    );
  }

  resizeFullContainer() {
    // Resize full-container to adjust for navigation bar
    $(window).resize(function() {
      $('.full-container').css('height', window.innerHeight - $("#app-navigation").outerHeight());
    });
    $(window).resize();
  }
}
