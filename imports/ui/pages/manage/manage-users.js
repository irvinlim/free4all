import { Meteor } from 'meteor/meteor';
import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import ManageUsersItems from '../../containers/manage/manage-users-items';

export class ManageUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: "",
      role: 'all-roles',
      sort: 'name-asc'
    }
  }

  handleSearch(event) {
    const code = event.which || event.keyCode;
    if (code != 13)
      return;

    this.setState({ searchQuery: $(event.target).val() });
  }

  render() {
    return (
      <div id="page-manage-users" className="page-container">
        <div className="container">
          <div className="flex-row nopad">
            <div className="col col-xs-12">

              <div className="search-box">
                <div className="flex-row nopad">
                  <div className="col col-xs-12 col-sm-6">
                    <TextField
                      id="manage-users-search-query"
                      type="text"
                      placeholder="Search by name or email..."
                      floatingLabelText="Search"
                      onKeyDown={ this.handleSearch.bind(this) }
                      floatingLabelFixed={true}
                      fullWidth={true}
                      underlineShow={false}
                      style={{ fontSize: 14 }} />
                  </div>
                  <div className="col col-xs-6 col-sm-3">
                    <SelectField
                      id="manage-users-role-select"
                      floatingLabelText="Role"
                      floatingLabelFixed={true}
                      style={{ fontSize: 14, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                      iconStyle={{ fill: "#333" }}
                      fullWidth={true}
                      underlineShow={false}
                      value={ this.state.role }
                      onChange={ (event, key, payload) => this.setState({ role: payload }) }>
                      <MenuItem value="all-roles" primaryText="All Users" />
                      <MenuItem value="no-role" primaryText="No Roles" />
                      <MenuItem value="moderator" primaryText="Moderators" />
                      <MenuItem value="admin" primaryText="Admins" />
                      <MenuItem value="reported" primaryText="Reported Users" />
                      <MenuItem value="banned" primaryText="Banned Users" />
                    </SelectField>
                  </div>
                  <div className="col col-xs-6 col-sm-3">
                    <SelectField
                      id="manage-users-sort-select"
                      floatingLabelText="Sort"
                      floatingLabelFixed={true}
                      style={{ fontSize: 14, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                      iconStyle={{ fill: "#333" }}
                      fullWidth={true}
                      underlineShow={false}
                      value={ this.state.sort }
                      onChange={ (event, key, payload) => this.setState({ sort: payload }) }>
                      <MenuItem value="most-relevant" primaryText="Most relevant first" />
                      <MenuItem value="name-asc" primaryText="By name (ascending)" />
                      <MenuItem value="name-desc" primaryText="By name (descending)" />
                    </SelectField>
                  </div>
                </div>
              </div>

              <ManageUsersItems
                sort={ this.state.sort }
                role={ this.state.role }
                searchQuery={ this.state.searchQuery } />

            </div>
          </div>
        </div>
      </div>
    );
  }
}
