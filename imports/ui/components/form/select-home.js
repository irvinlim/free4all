import React from 'react';

import SelectHomeDialog from './select-home-dialog';

import { joinCommunity, setHomeCommunity } from '../../../api/users/methods';

export default class SelectHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHomeLocOpen: false
    };
  }

  closeDialog() {
    this.setState({ isHomeLocOpen: false });
  }

  setHomeLoc(community){
    this.closeDialog();

    // Set session
    Session.setPersistent('homeLocation', {
      coordinates: community.coordinates,
      zoom: community.zoom,
      commId: community._id
    });

    if (Meteor.userId()) {
      // Join the Community
      joinCommunity.call({ userId: Meteor.userId(), commId: community._id });

      // Set as Home Community if not already set
      setHomeCommunity.call({
        userId: Meteor.userId(),
        community: {
          _id: community._id,
          coordinates: community.coordinates,
          zoom: community.zoom,
        },
      });
    }
  }

  checkHomeLoc() {
    // Open dialog if not set
    if (!Session.get('homeLocation'))
      this.setState({ isHomeLocOpen: true });
  }

  componentDidMount() {
    this.checkHomeLoc();
  }

  render() {
    return (
      <SelectHomeDialog
        isHomeLocOpen={ this.state.isHomeLocOpen }
        closeSelectHomeModal={ this.closeDialog.bind(this) }
        setHomeLoc={ this.setHomeLoc.bind(this) } />
    );
  }
}
