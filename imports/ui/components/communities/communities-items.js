import React from 'react';
import Subheader from 'material-ui/Subheader';
import { GridList, GridTile } from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import ReactList from 'react-list';
import { browserHistory } from 'react-router';

import * as Colors from 'material-ui/styles/colors';
import * as Helper from '../../../util/helper';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as AvatarHelper from '../../../util/avatar';
import * as IconsHelper from '../../../util/icons';

let communities = [];
let props = {};

// const photoAvatar = (ga) => (
//   <div className="photo-avatar" style={{ backgroundImage: 'url(' + AvatarHelper.getUrl(ga.avatarId, 350) + ')' }}>
//   </div>
// );

// const iconAvatar = (ga) => (
//   <div className="icon-avatar" style={{ backgroundColor: GiveawaysHelper.getStatusColor(ga) }}>
//     { GiveawaysHelper.getCategoryIcon(ga, { color: Colors.grey50 }) }
//   </div>
// );

const listItemRow = (comm) => (
  <Paper key={ comm._id } style={{ marginBottom: 20 }} 
    className="giveaway giveaway-timeline-item" 
    onTouchTap={ (event) => browserHistory.push('/community/' + comm._id) }>
    
    <div className="flex-row">
      <div className="col nopad col-xs-4 col-sm-3">
      { comm.website }
      </div>
      <div className="col col-xs-8 col-sm-9">
        <h3 className="lines-1">{ comm.name }</h3>
        <h3 className="lines-1">{ comm.count }</h3>
      </div>

    </div>
  </Paper>
);

const gridItemTile = (comm) => (
  <GridTile
    key={ comm._id }
    className="giveaway giveaway-timeline-item"
    title={ comm.name }
    titleBackground='rgba(0, 0, 0, 0.55)'
    onTouchTap={ (event) => browserHistory.push('/community/' + comm._id) }>
    {comm.count}
  </GridTile>
);

const renderItem = (index, key) => {
  if (props.view == "list")
    return listItemRow(communities[index]);
  else
    return gridItemTile(communities[index]);
};

export class CommunitiesItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gridListCols: 2,
      gridListCellHeight: 768
    };
  }

  componentDidMount() {
    $(window).resize(event => {
      this.setState({
        gridListCols: $(window).width() < 768 ? 2 : 4,
        gridListCellHeight: $(window).width() < 768 ? 180 : 250
      });
    }).resize();
  }

  render() {
    props = this.props.props;
    communities = this.props.communities;

    if (props.view == "list")
      return (
        <div id="timeline-items">
          <ReactList
            itemRenderer={ renderItem }
            length={ communities.length }
            type='variable'
          />
        </div>
      );

    else
      return (
        <div id="timeline-items">
          <GridList cols={ this.state.gridListCols } cellHeight={ this.state.gridListCellHeight }>
            { communities.map(ga => gridItemTile(ga)) }
          </GridList>
        </div>
      );
  }
}
