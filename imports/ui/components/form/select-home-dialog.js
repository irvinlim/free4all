import React from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import { Communities } from '../../../api/communities/communities';
import { Grid, Row, Col } from 'react-bootstrap';
import * as IconsHelper from '../../../util/icons';
import * as ImagesHelper from '../../../util/images';
import { Loading } from '../../components/loading';

const customContentStyle = {
  width: "93%",
  maxWidth: "none"
};

const customTitleStyle = {
  color: "#FFFFFF",
  backgroundColor: "#3F51B5",
  marginBottom: "33px",
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
    }

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
      <Col xs={6} md={3} className="schoolCommunity"
        style={{
          minHeight:"99px",
          MaskImage: 'url('+ ImagesHelper.getUrlScale(community.pictureId, 350) +')',
          WebkitMaskImage: 'url('+ ImagesHelper.getUrlScale(community.pictureId, 350) +')',
        }}
        onTouchTap={this.props.setHomeLoc.bind(this, community)} >
      </Col>
    )
  }

  render() {

    return (
      <Dialog
        title="View Universities"
        titleStyle={customTitleStyle}
        modal={false}
        contentStyle={customContentStyle}
        open={this.state.open}
        onRequestClose={this.handleClose.bind(this)}
      >
      <Grid>
        <Row>
        { this.state.featured ? this.renderCommunities() : <Loading /> }
        </Row>
      </Grid>

      </Dialog>
    );
  }

}
