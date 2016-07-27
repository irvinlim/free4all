import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid } from 'react-bootstrap';

import FormSettings from '../containers/profile/form-settings';

export class Settings extends React.Component {
  render() {
    return (
      <div id="page-settings" className="page-container">
        <Grid>
          <div className="flex-row nopad">
            <div className="col col-xs-12">
              <FormSettings />
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}
