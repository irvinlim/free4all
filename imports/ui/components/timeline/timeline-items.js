import React from 'react';
import Subheader from 'material-ui/Subheader';
import { GridList, GridTile } from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import ReactList from 'react-list';

import * as Colors from 'material-ui/styles/colors';
import * as Helper from '../../../util/helper';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as AvatarHelper from '../../../util/avatar';
import * as IconsHelper from '../../../util/icons';

let giveaways = [];
let props = {};

const photoAvatar = (ga) => (
  <div className="photo-avatar" style={{ backgroundImage: 'url(' + AvatarHelper.getUrl(ga.avatarId, 350) + ')' }}>
  </div>
);

const iconAvatar = (ga) => (
  <div className="icon-avatar" style={{ backgroundColor: GiveawaysHelper.getStatusColor(ga) }}>
    { GiveawaysHelper.getCategoryIcon(ga, { color: Colors.grey50 }) }
  </div>
);

const listItemRow = (ga) => (
  <Paper key={ ga._id } style={{ marginBottom: 20 }} className="giveaway giveaway-card">
    <div className="flex-row">
      <div className="col nopad col-xs-4 col-sm-3">
          { ga.avatarId ? photoAvatar(ga) : iconAvatar(ga) }
      </div>
      <div className="col col-xs-8 col-sm-9">
        <h3 className="lines-1">{ ga.title }</h3>
        <h5 className="lines-1">{ GiveawaysHelper.categoryBreadcrumbs(ga) }</h5>
        <p className="description lines-2 ddd">{ GiveawaysHelper.description(ga) }</p>
        <p className="small-text lines-1">{ GiveawaysHelper.compactDateRange(ga.startDateTime, ga.endDateTime) }</p>

        <div className="footer-actions">
          <div className="upvotes">
            { IconsHelper.icon("fa fa-thumbs-o-up", { fontSize: 14, color: "#9e9e9e", lineHeight: "20px" }) } { GiveawaysHelper.countUpvotes(ga) }
          </div>
          <div className="downvotes">
            { IconsHelper.icon("fa fa-thumbs-o-down", { fontSize: 14, color: "#9e9e9e", lineHeight: "20px" }) } { GiveawaysHelper.countDownvotes(ga) }
          </div>
        </div>
      </div>
    </div>
  </Paper>
);

const gridItemTile = (ga) => (
  <GridTile
    key={ ga._id }
    title={ ga.title }
    titleBackground='rgba(0, 0, 0, 0.55)'
    subtitle={ GiveawaysHelper.descriptionFirstLine(ga) }>
    { ga.avatarId ? photoAvatar(ga) : iconAvatar(ga) }
  </GridTile>
);

const renderItem = (index, key) => {
  if (props.view == "list")
    return listItemRow(giveaways[index]);
  else
    return gridItemTile(giveaways[index]);
};

export class TimelineItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gridListCols: 2,
      gridListCellHeight: 768
    };
  }

  componentDidMount() {
    Helper.onRenderDot3();

    $(window).resize(event => {
      this.setState({
        gridListCols: $(window).width() < 768 ? 2 : 4,
        gridListCellHeight: $(window).width() < 768 ? 180 : 250
      });
    }).resize();
  }

  componentDidUpdate() {
    Helper.onRenderDot3();
  }

  render() {
    props = this.props.props;
    giveaways = this.props.giveaways;

    if (props.view == "list")
      return (
        <div id="timeline-items">
          <ReactList
            itemRenderer={ renderItem }
            length={ giveaways.length }
            type='variable'
          />
        </div>
      );

    else
      return (
        <div id="timeline-items">
          <GridList cols={ this.state.gridListCols } cellHeight={ this.state.gridListCellHeight }>
            { giveaways.map(ga => gridItemTile(ga)) }
          </GridList>
        </div>
      );
  }
}
