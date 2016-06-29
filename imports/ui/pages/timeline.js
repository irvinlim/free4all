import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import TimelineItems from '../containers/timeline/timeline-items';

export class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: "current",
      view: "list",
      parentCategoryId: null,
      categoryId: "all-categories",
      searchQuery: "",
      sort: "highest-rated",
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

  render() {
    return (
      <div id="timeline">
        <Tabs
          id="timeline-tabs"
          tabItemContainerStyle={{ backgroundColor: "#90a4cf" }}
          inkBarStyle={{ backgroundColor: "#3a4b6e" }}>
          <Tab style={{ color: "#333" }} label="Current" onActive={ this.makeHandleSetTab("current").bind(this) } />
          <Tab style={{ color: "#333" }} label="Past" onActive={ this.makeHandleSetTab("past").bind(this) } />
          <Tab style={{ color: "#333" }} label="All-Time" onActive={ this.makeHandleSetTab("all-time").bind(this) } />
          <Tab style={{ color: "#333" }} label="Search" onActive={ this.makeHandleSetTab("search").bind(this) }>
            <div id="timeline-search">
              <div className="flex-row nopad">
                <div className="col col-xs-12 col-sm-6">
                  <TextField
                    id="timeline-search-query"
                    type="text"
                    placeholder="Search for a giveaway..."
                    floatingLabelText="Search"
                    floatingLabelFixed={true}
                    fullWidth={true}
                    style={{ fontSize: 14 }} />
                </div>
                <div className="col col-xs-6 col-sm-3">
                  <SelectField
                    id="timeline-category-select"
                    floatingLabelText="Category"
                    floatingLabelFixed={true}
                    style={{ fontSize: 14, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                    iconStyle={{ fill: "#333" }}
                    fullWidth={true}
                    value={ this.state.categoryId }
                    onChange={ this.handleSetCategory.bind(this) }>
                    <MenuItem value="all-categories" primaryText="All Categories" />
                  </SelectField>
                </div>
                <div className="col col-xs-6 col-sm-3">
                  <SelectField
                    id="timeline-sort-select"
                    floatingLabelText="Sort"
                    floatingLabelFixed={true}
                    style={{ fontSize: 14, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                    iconStyle={{ fill: "#333" }}
                    fullWidth={true}
                    value={ this.state.sort }
                    onChange={ this.handleSetSort.bind(this) }>
                    <MenuItem value="highest-rated" primaryText="Highest rated first" />
                    <MenuItem value="most-popular" primaryText="Most popular first" />
                    <MenuItem value="nearest" primaryText="Nearest first" />
                    <MenuItem value="newest-first" primaryText="Newest First" />
                    <MenuItem value="oldest-first" primaryText="Oldest First" />
                  </SelectField>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>

        <div id="timeline-view">

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
      </div>
    );
  }
}
