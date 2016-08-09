import { Meteor } from 'meteor/meteor';
import React from 'react';

import ProfileComponent from '../containers/profile/profile';

export class Profile extends React.Component {
  render() {
    return (
      <div id="page-profile" className="page-container profile" style={{ overflow: "hidden" }}>
        <div className="container">
          <div className="flex-row nopad" style={{ padding: "0 0 5px" }}>
            <div className="col col-xs-12">
              <ProfileComponent userId={ this.props.params.userId ? this.props.params.userId : Meteor.userId() } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
