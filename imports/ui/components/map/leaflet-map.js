import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Giveaways } from '../../../api/giveaways/giveaways';
import LeafletMapObject from './leaflet-map-object';

export default class LeafletMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.subscription = Meteor.subscribe('giveaways');
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
        map.addMarker(ga.id, ga, () => this.props.onSelectGa(ga));
      },
      changed: ga => {
        map.removeMarker(ga.id);
        map.addMarker(ga.id, ga, () => this.props.onSelectGa(ga));
      },
      removed: ga => {
        map.removeMarker(ga.id);
      },
    });
  }

  componentWillUnmount() {
    this.subscription.stop();
  }
}
