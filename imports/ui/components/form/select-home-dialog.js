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
          style={{ height: 50, minHeight: "102px" }}
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
          <div className="flex-row welcome-text" style={{ paddingBottom: 0 }}>
            <div className="col col-xs-12" >
              <p>{ ImagesHelper.makeScale(Meteor.settings.public.logoImageId, 250, "free4all-logo") }</p>
              <h1>Welcome to Free4All!</h1>
              <p>Find the best freebie giveaways on campus!</p>
              <p style={{fontSize: "12px"}}>Be it free buffet lunches, goodie bags, ice cream, or more.</p>
              <p>Help friends save money by sharing free food with them.</p>
              <p style={{fontSize: "12px"}}>Tackle food waste by helping events to clear unfinished food!</p>
              <p>Save giveaway items that would be otherwise thrown away!</p>
              <h3 style={{paddingTop: "18px", textAlign: "center",}}>
                To begin, select your university below:
              </h3>
            </div>
          </div>
          <div className="flex-row featured-communities" style={{paddingTop: 0}}>
            { this.state.featured ? this.renderCommunities() : <Loading /> }
          </div>

        </div>

      </Dialog>
    );
  }

}
