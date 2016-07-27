import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid } from 'react-bootstrap';

import ManageParentCategoriesComponent from '../../containers/manage/manage-parent-categories';

export class ManageParentCategories extends React.Component {
  render() {
    return (
      <div id="page-manage-parent-categories" className="page-container">
        <Grid>
          <div className="flex-row nopad">
            <div className="col col-xs-12">
              <ManageParentCategoriesComponent />
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}
