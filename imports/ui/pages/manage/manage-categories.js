import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid } from 'react-bootstrap';

import ManageCategoriesComponent from '../../containers/manage/manage-categories';

export class ManageCategories extends React.Component {
  render() {
    return (
      <div id="page-manage-categories" className="page-container">
        <Grid>
          <div className="flex-row nopad">
            <div className="col col-xs-12">
              <ManageCategoriesComponent />
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}
