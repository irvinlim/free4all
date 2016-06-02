import React from 'react';
import { Meteor } from 'meteor/meteor';

const nl2br = require('react-nl2br');

export default class MapInfoBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const ga = this.props.ga;
    let infoBoxContent = (
      <div />
    );

    if (ga) {
      infoBoxContent = (
        <div>
          <h3>{ ga.title }</h3>
          <p>{ ga.description ? nl2br(ga.description) : (<em>No description</em>) }</p>
        </div>
      );
    }

    return (
      <div id="map-info-box">
        { infoBoxContent }
      </div>
    );
  }
}
