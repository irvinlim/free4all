import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Giveaways } from '../../../api/giveaways/giveaways';
import LeafletMapObject from './leaflet-map-object';

export default class LeafletMap extends React.Component {
  componentWillMount() {
    this.subscriptions = [
      Meteor.subscribe('categories'),
      Meteor.subscribe('status-types'),
      Meteor.subscribe('giveaways'),
    ];
  }

  render() {
    return (
      <div id="main-map"></div>
    );
  }

  componentDidMount() {
    const map = new LeafletMapObject('main-map');

    Giveaways.find().observe({
      added: ga => {
        Meteor.subscribe('status-updates-for-giveaway', ga._id, function() {
          map.addMarker(ga._id, ga, () => this.props.onSelectGa(ga));
        });
      },
      changed: ga => {
        Meteor.subscribe('status-updates-for-giveaway', ga._id, function() {
          map.removeMarker(ga._id);
          map.addMarker(ga._id, ga, () => this.props.onSelectGa(ga));
        });
      },
      removed: ga => {
        Meteor.subscribe('status-updates-for-giveaway', ga._id, function() {
        map.removeMarker(ga._id);
        });
      },
    });
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.stop());
  }
}
