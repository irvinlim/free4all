import { Meteor } from 'meteor/meteor';
import React from 'react';

import ManageStatusTypesComponent from '../../containers/manage/manage-status-types';

export class ManageStatusTypes extends React.Component {
  render() {
    return (
      <div id="page-manage-status-types" className="page-container">
        <div className="container">
          <div className="flex-row nopad">
            <div className="col col-xs-12">
              <ManageStatusTypesComponent />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
