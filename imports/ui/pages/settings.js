import { Meteor } from 'meteor/meteor';
import React from 'react';

import FormSettings from '../containers/profile/form-settings';

export class Settings extends React.Component {
  render() {
    return (
      <div id="page-settings" className="page-container">
        <div className="container">
          <div className="flex-row nopad">
            <div className="col col-xs-12">
              <FormSettings />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
