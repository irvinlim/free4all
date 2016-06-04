import React from 'react';
import FontIcon from 'material-ui/FontIcon';

import { ParentCategories } from '../../../api/parent-categories/parent-categories';
import { Categories } from '../../../api/categories/categories';
import { StatusTypes } from '../../../api/status-types/status-types';
import { StatusUpdates } from '../../../api/status-updates/status-updates';

import * as Helper from '../../../modules/helper';

export default class MapInfoBoxTop extends React.Component {
  constructor(props) {
    super(props);
  }

  iconRow(icon, content) {
    if (content && content.length)
      return (
        <div className="map-info-row">
          <FontIcon className="material-icons">{ icon }</FontIcon>
          <p>{ content }</p>
        </div>
      );
  }

  render() {
    const ga = this.props.ga;
    let renderContent = (
      <em>Select a giveaway to see more information.</em>
    );

    if (ga) {
      const latestStatus = StatusUpdates.findOne({ userId: ga.userId, giveawayId: ga._id }, { sort: { date: "desc" } });
      const latestStatusType = StatusTypes.findOne(latestStatus.statusTypeId);
      const category = Categories.findOne(ga.categoryId);
      const parentCategory = ParentCategories.findOne(category.parent);

      renderContent = (
        <div>
          <h3>{ ga.title }</h3>
          <p className="category">{ parentCategory.name + ": " + category.name }</p>
          <p className="description">{ ga.description ? Helper.nl2br(ga.description) : (<em>No description</em>) }</p>
          { this.iconRow("date_range", Helper.compact_date_range(ga.dateStart, ga.dateEnd)) }
          { this.iconRow("location_on", ga.location ) }
          { Helper.is_ongoing(ga.dateStart, ga.dateEnd) ?
              this.iconRow("info_outline", "Status: " + latestStatusType.label ) :
              null }
        </div>
      );
    }

    return (
      <div className="map-sidebar-box" id="info-box-top">
        { renderContent }
      </div>
    );
  }
}
