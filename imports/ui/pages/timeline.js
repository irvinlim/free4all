import React from 'react';
import TextField from 'material-ui/TextField';
import { Tabs, Tab } from 'material-ui/Tabs';
import TimelineItems from '../containers/timeline/timeline-items';

export class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: "current",
      offset: 0,
      perPage: 10,
      view: "list",
      parentCategoryId: null,
      categoryId: null,
      searchQuery: "",
    };
  }

  makeHandleSetTab(tab) {
    return (event) => this.setState({ tab: tab });
  }

  render() {
    return (
      <div id="timeline">
        <div id="timeline-search" style={{ maxWidth: 600, margin: "20px auto" }}>
          <TextField hintText="Search for a giveaway..." fullWidth={true} />
        </div>

        <Tabs
          id="timeline-tabs"
          style={{ maxWidth: 300, margin: "0 auto" }}
          tabItemContainerStyle={{ backgroundColor: "none" }}
          inkBarStyle={{ width: 100/6 + "%", marginLeft: 100/12 + "%" }}>
          <Tab style={{ color: "#333" }} label="Current" onActive={ this.makeHandleSetTab("current").bind(this) } />
          <Tab style={{ color: "#333" }} label="Past" onActive={ this.makeHandleSetTab("past").bind(this) } />
          <Tab style={{ color: "#333" }} label="All-Time" onActive={ this.makeHandleSetTab("all-time").bind(this) } />
        </Tabs>

        <TimelineItems
          tab={ this.state.tab }
          offset={ this.state.offset }
          perPage={ this.state.perPage }
          view={ this.state.view }
          categoryId={ this.state.categoryId }
          parentCategoryId={ this.state.parentCategoryId }
          searchQuery={ this.state.searchQuery } />
      </div>
    );
  }
}
