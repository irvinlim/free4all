import React from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Scrollbars } from 'react-custom-scrollbars';

import { Communities } from '../../../api/communities/communities';
import { Grid, Row, Col } from 'react-bootstrap';
import * as IconsHelper from '../../../util/icons';
import * as ImagesHelper from '../../../util/images';
import { Loading } from '../../components/loading';

const customTitleStyle = {
  color: "#FFFFFF",
  backgroundColor: "#3F51B5",
  textTransform: "uppercase",
  fontWeight: 100,
  textAlign: "center",
  letterSpacing: "2px",
  fontSize: "20px",
}

export default class SelectHomeDialog extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      open: false,
      featured: null,
    };
  }

  handleOpen() {
    this.props.openSelectHomeModal();
  }

  handleClose() {
    this.props.closeSelectHomeModal();
  }

  componentDidMount(){
    const self = this;
    Meteor.subscribe('featured-communities', function(){
      const communities = Communities.find(
        { feature: true },
        { sort: { createdAt: 1 } }
      ).fetch();
      self.setState({ featured: communities });
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState({ open: nextProps.isHomeLocOpen });
  }

  renderCommunities(){
    return this.state.featured.map( community => this.renderCommunity(community));
  }

  renderCommunity(community){
    return (
      <div key={community._id} className="col col-xs-6 col-sm-3 schoolCommunity">
        <FlatButton
          label={ ImagesHelper.makeScale(community.pictureId, 350) }
          style={{ height: 50 }}
          onTouchTap={ this.props.setHomeLoc.bind(this, community) } />
      </div>
    );
  }

  render() {

    return (
      <Dialog
        title="Welcome"
        className="dialog welcome-dialog"
        bodyClassName="welcome-dialog-body"
        contentClassName="welcome-dialog-container"
        titleStyle={customTitleStyle}
        modal={true}
        autoScrollBodyContent={true}
        open={this.state.open}
        onRequestClose={this.handleClose.bind(this)}>

        <div className="container" style={{ width: "100%" }}>
          <div className="flex-row welcome-text">
            <div className="col col-xs-12">
              <p>{ ImagesHelper.makeScale(Meteor.settings.public.logoImageId, 250, "free4all-logo") }</p>
              <h1>Welcome to Free4All!</h1>
              <p>We collect and curate the best freebie giveaways on your school campus, be it free buffet lunches, goodie bags, ice cream, or anything under the sun.</p>
              <p>Not only do we help people save money by finding them free meals, we also help to tackle food waste by helping events to clear unfinished food or giveaway items that would be otherwise thrown away.</p>
              <p>To begin, select your university below:</p>
            </div>
          </div>

          <div className="flex-row featured-communities">
            { this.state.featured ? this.renderCommunities() : <Loading /> }
          </div>
        </div>

      </Dialog>
    );
  }

}
