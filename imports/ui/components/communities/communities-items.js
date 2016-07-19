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
import * as ImagesHelper from '../../../util/images';

let communities = [];
let props = {};

const photoAvatar = (comm) => (
  <div className="photo-avatar" style={{ backgroundImage: 'url(' + AvatarHelper.getUrl(comm.pictureId, 350) + ')' }}>
  </div>
);

const listItemRow = (comm) => (
  <Paper key={ comm._id } style={{ marginBottom: 20 }} 
    className="giveaway giveaway-timeline-item" 
    onTouchTap={ (event) => browserHistory.push('/community/' + comm._id) }>
    
    <div className="flex-row" style={{padding: "45px 0"}}>
      <div className="col somepad col-xs-4 col-sm-3">
        <div className="photo-avatar-community" style={{ backgroundImage: 'url('+ ImagesHelper.getUrlScale(comm.pictureId, 350) +')'}}>
        </div>
      </div>
      <div className="col col-xs-5 col-sm-7">
        <h3 className="lines-1">{ comm.name }</h3>
        <p className="lines-1">{ comm.description }</p>
        <p className="small-text lines-1">{ comm.website }</p>
      </div>
      <div className="col col-xs-3 col-sm-2">
        <h3 className="description">{ comm.count }</h3>
        <p className="small-text">{ Helper.pluralizer(comm.count, "member", "members") }</p>
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
