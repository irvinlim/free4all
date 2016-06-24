import React from 'react';
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

  render() {
    return (
      <div id="timeline">
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
