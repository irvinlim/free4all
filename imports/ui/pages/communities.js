import React from 'react';
import { Grid } from 'react-bootstrap';
import { Tabs, Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

import TimelineItems from '../containers/timeline/timeline-items';
import { TimelineCategoriesListItems } from '../components/categories/timeline-categories-list-items';

import * as IconsHelper from '../../util/icons';

export class Communities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: "current",
      view: "list",
      parentCategoryId: null,
      categoryId: "all-categories",
      searchQuery: "",
      sort: "most-relevant",
    };
  }

  makeHandleSetTab(tab) {
    return (event) => this.setState({ tab: tab });
  }

  handleSetCategory(event, key, payload) {
    this.setState({ categoryId: payload });
  }

  handleSetSort(event, key, payload) {
    this.setState({ sort: payload });
  }

  handleSearch(event) {
    const code = event.which || event.keyCode;
    if (code != 13)
      return;

    this.setState({ searchQuery: $(event.target).val() });
  }

  makeHandleSetView(view) {
    return (event) => this.setState({ view: view });
  }

  render() {
    return (
      <div id="timeline">
        <Grid>

        <div className="timeline-bar-top">
          <div id="timeline-search">
            <div className="flex-row nopad">
              <div className="col col-xs-12 col-sm-9">
                <TextField
                  id="community-search-query"
                  type="text"
                  placeholder="Search for a giveaway..."
                  floatingLabelText="Search"
                  onKeyDown={ this.handleSearch.bind(this) }
                  floatingLabelFixed={true}
                  fullWidth={true}
                  underlineShow={false}
                  style={{ fontSize: 14 }} />
              </div>
              <div className="col col-xs-12 col-sm-3">
                <SelectField
                  id="timeline-sort-select"
                  floatingLabelText="Sort"
                  floatingLabelFixed={true}
                  style={{ fontSize: 14, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  iconStyle={{ fill: "#333" }}
                  fullWidth={true}
                  underlineShow={false}
                  value={ this.state.sort }
                  onChange={ this.handleSetSort.bind(this) }>
                  <MenuItem value="most-relevant" primaryText="Most relevant first" />
                  <MenuItem value="highest-rated" primaryText="Highest rated first" />
                  <MenuItem value="newest-first" primaryText="Newest First" />
                  <MenuItem value="oldest-first" primaryText="Oldest First" />
                </SelectField>
              </div>
            </div>
          </div>

        </div>

        <TimelineItems
          tab={ this.state.tab }
          offset={ this.state.offset }
          perPage={ this.state.perPage }
          sort={ this.state.sort }
          view={ this.state.view }
          categoryId={ this.state.categoryId }
          parentCategoryId={ this.state.parentCategoryId }
          searchQuery={ this.state.searchQuery } />

        </Grid>
      </div>
    );
  }
}
