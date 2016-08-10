import { Meteor } from 'meteor/meteor';
import React from 'react';
import Store from '../../../startup/client/redux-store';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AutoComplete from 'material-ui/AutoComplete';
import { Bert } from 'meteor/themeteorchef:bert';
import FontIcon from 'material-ui/FontIcon';
import { GridList, GridTile } from 'material-ui/GridList';
import LinearProgress from 'material-ui/LinearProgress';
import Formsy from 'formsy-react';
import { FormsyDate, FormsyText, FormsyTime } from 'formsy-material-ui/lib';
import { Row, Col } from 'react-bootstrap';
import TagsInput from 'react-tagsinput';

import AllCategoriesList from '../../containers/categories/all-categories-list';
import IncludedCommunities from '../../components/form/included-communities';
import RemoveGiveawayDialog from '../../components/form/remove-giveaway-dialog';
import LeafletMapPreview from './leaflet-map-preview';
import { geocode } from '../../../util/geocode.js';
import { shortId, sanitizeURL } from '../../../util/helper.js';
import * as IconsHelper from '../../../util/icons';

import { insertGiveaway, updateGiveaway, removeGiveaway } from '../../../api/giveaways/methods.js';
import { Categories } from '../../../api/categories/categories.js';
import { StatusTypes } from '../../../api/status-types/status-types.js';

export default class InsertBtnDialog extends React.Component {

  constructor(props){
    super(props);

    const startTime = new Date()
        , endTime   = moment(startTime.setMinutes(0,0,0)).add(1,'h').toDate()

    this.initialState = {
      canSubmit: false,
      isOpen: props.isModalOpen,
      tags: [],
      parentCatId: "",
      childCatId: "",
      childCatName:"Select Category",
      childCatIcon: "",
      title:"",
      description:"",
      website:"",
      startDate: undefined,
      endDate: undefined,
      startTime,
      endTime,
      latLng: { lat: null, lng: null },
      location:"",
      dataSource: [],
      isCatMenuOpen: false,
      tile: null,
      avatarId: "",
      loadingFile: false,
      zoom: 1,
      commIdsVal: [],
      commIdsOpt: [],
      removeGiveawayPromptOpen: false,
      gaId: null,
    };

    this.state = this.initialState;

    this.handleAddLocation = () => {
      if(this.state.gaId)
        props.hideModal();
      else
        props.closeModal();
      props.addRGeoTriggerMarker();
      props.hideMarkers();
      props.setZoomBehaviour('center');
    }

    this.geocodeInputLoc = (value) => {
      if(value.length > 5){
        geocode(Meteor.settings.public.MapBox.accessToken, value, this.props.mapCenter,
        (locObjs) => {
          let locArr = locObjs.map((loc)=> {
            loc.text = loc.place_name;
            loc.value = loc.place_name;
            return loc;
          });
          this.setState({
            dataSource: locArr
          });
        })
      }

      this.setState({location: value});
    };

    this.handleLocationSelect = (loc, idx) => {
      this.setState({
        latLng: {lat: loc.center[1], lng: loc.center[0]},
        location: loc.place_name
      })
    };

    this.errorMessages ={
      wordsError: "Please only use letters",
      numericError: "Please provide a number",
      urlError: "Please provide a valid URL",
    };

    this.styles = {
      actionsContainerStyle:{
        backgroundColor: "rgb(224, 224, 224)",
      },
      paperStyle: {
        width: "95%",
        margin: 'auto',
        padding: 20,
      },
      titleStyle: {
        fontWeight: 100,
        fontSize: "18px",
        textTransform: "uppercase",
        textAlign: "center",
        backgroundColor: "rgb(224, 224, 224)",
      },
      submitStyle: {
        "marginTop": "32",
      },
      textFieldStyle: {
        pointerEvents: "none",
      },
    };


    this.handleClose = () => {
      props.closeModal();
      this.setState({ isCatMenuOpen: false });
    };

    this.formatDate = (date) => {
      return moment(date).format("dddd, Do MMM YYYY");
    };

    this.setChildCat = e => {
      this.setState({
        childCatId: e.currentTarget.getAttribute("id"),
        childCatName: e.currentTarget.getAttribute("name"),
        childCatIcon: e.currentTarget.getAttribute("alt"),
        isCatMenuOpen: false
      });
    };

    this.handleOpenCatMenu = e => {
      e.preventDefault();
      this.setState({
        isCatMenuOpen: true,
        anchorEl: e.currentTarget,
      });
    }

    this.handleUpload = (e) => {
      const self = this;
      const files = e.currentTarget.files;
      let tile = {};
      tile.files= files;

      this.setState({ loadingFile: true });

      // upload files to root cloudinary folder
      Cloudinary.upload(files, {}, function(err, res) {
        tile.res=res;
        self.setState({ tile: tile});
        self.setState({ loadingFile : false})
      });
    }

    this.submitForm = this.submitForm.bind(this);
  }

submitForm() {
  event.preventDefault();
  this.setState({ canSubmit: false })
  const data = Object.assign({}, this.state);
  const userId = Meteor.userId();
  data.title = String(data.title);
  data.description = String(data.description);
  data.website = data.website ? sanitizeURL(data.website) : "";
  data.location = String(data.location);
  data.userId = String(userId);
  data.removeUserId = String(userId);
  data.inclCommIds = data.commIdsVal.map(comm => comm.value);

  if (data.tile){
    data.avatarId = data.tile.res.public_id;
    const imgUrlPre = data.tile.res.secure_url;
    data.imgUrl = imgUrlPre.split('upload')[0]+ 'upload/' + 'h_300,c_scale' + imgUrlPre.split('upload')[1];
  }

  let startHr       = data.startTime.getHours()
    , startMin      = data.startTime.getMinutes()
    , endHr         = data.endTime.getHours()
    , endMin        = data.endTime.getMinutes()
    , startDateTime = moment(data.startDate).set('hour', startHr).set('minute',startMin).toDate()
    , endDateTime   = moment(data.endDate).set('hour', endHr).set('minute',endMin).toDate();

  let availableStatus = StatusTypes.findOne({ relativeOrder: 0 });

  // check if no end date or earlier than start datetime
  if(startDateTime > endDateTime){
    Meteor.setTimeout(function(){
      Bert.alert('Start time is later than End time', 'danger');
    },1000);
    this.setState({ startTime: undefined, startDate: undefined, endTime: undefined, endDate: undefined})
    return;
  }

  const ga = {
    title: data.title,
    description: data.description,
    website: data.website,
    startDateTime: startDateTime,
    endDateTime: endDateTime,
    location: data.location,
    coordinates: [data.latLng.lng, data.latLng.lat],
    categoryId: data.childCatId,
    tags: data.tags,
    userId: data.userId,
    statusUpdates: [{ statusTypeId: availableStatus._id, date: new Date(), userId: data.userId }],
    avatarId: data.avatarId,
    inclCommIds: data.inclCommIds,
  }

  if(this.state.gaId){
    updateGiveaway.call({_id:data.gaId, update:ga}, (error)=>{
      if (error) {
        Bert.alert(error.reason, 'Error updating giveaway');
        this.setState({ canSubmit: true });
      } else {
        this.props.closeModal();
        this.props.resetLoc();

        this.setState(this.initialState);
        Bert.alert('Giveaway Updated!', 'success');
      }
    })
  } else {
    insertGiveaway.call(ga, (error)=>{
      if (error) {
        Bert.alert(error.reason, 'Error adding Giveaway');
        this.setState({ canSubmit: true });
      } else {
        this.props.closeModal();
        this.props.resetLoc();

        this.setState(this.initialState);
        Bert.alert('Giveaway Added!', 'success');
      }
    })
  }
}
removeGiveaway(event) {
  this.props.closeModal();
  this.props.resetLoc();

  removeGiveaway.call({ _id: this.state.gaId, userId: Meteor.userId() }, error => {
    if (error) {
      Bert.alert(error.reason, 'Error updating giveaway');
    } else {
      this.setState(this.initialState);
      Bert.alert('Giveaway Deleted!', 'success');
    }
  });
}

componentWillReceiveProps(nextProps){
  if(this.props.isModalOpen !== nextProps.isModalOpen)
    this.setState({ isOpen: nextProps.isModalOpen })

  if(nextProps.locArr.length > 0 && this.props.latLng.lat !== nextProps.latLng.lat){
    let locationText = nextProps.locArr[0].text;
    const strSplitIdx = locationText.indexOf(',');
    const locName = locationText.substr(0, strSplitIdx);
    this.setState({
      latLng: nextProps.latLng,
      dataSource: nextProps.locArr,
      location: locName,
      zoom: nextProps.zoom
    })
  }

  // if edit route
  const gaEdit = nextProps.gaEdit;
  let gaEditTile = null;
  if(gaEdit && gaEdit !== this.props.gaEdit){
    // placeholder for grid tile text
    if(gaEdit.avatarId){
      gaEditTile = {
        files:[{name:""}],
        res: {secure_url:""}
      };
      gaEditTile.res.secure_url = $.cloudinary.url(gaEdit.avatarId);
    }
    const childCats = Categories.find().fetch();
    const childCat = childCats.find(cat => cat._id === gaEdit.categoryId);

    this.setState({
      title: gaEdit.title,
      description: gaEdit.description,
      website: gaEdit.website,
      startDate: gaEdit.startDateTime,
      startTime: gaEdit.startDateTime,
      endDate: gaEdit.endDateTime,
      endTime: gaEdit.endDateTime,
      location: gaEdit.location,
      latLng: { lng: gaEdit.coordinates[0], lat: gaEdit.coordinates[1] },
      tags: gaEdit.tags,
      tile: gaEditTile,
      childCatId: gaEdit.categoryId,
      childCatName: childCat.name,
      childCatIcon: childCat.iconClass,
      avatarId: gaEdit.avatarId,
      gaId: gaEdit._id,
      commIdsVal: gaEdit.inclCommIds,
      zoom: nextProps.zoom,
    });
  }
}

render() {
  let { paperStyle, submitStyle, titleStyle, actionsContainerStyle, textFieldStyle} = this.styles;
  let { wordsError, numericError, urlError } = this.errorMessages;
  const actionBtns = this.props.gaEdit ?
  [
    <FlatButton
      label="Update"
      primary={true}
      disabled={!this.state.canSubmit}
      onTouchTap={this.submitForm} />,
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleClose} />,
    <FlatButton
      label="Delete"
      secondary={true}
      onTouchTap={ event => this.setState({ removeGiveawayPromptOpen: true }) } />,
  ]:[
    <FlatButton
      label="Submit"
      primary={true}
      disabled={!this.state.canSubmit}
      onTouchTap={this.submitForm} />,
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleClose} />,
  ]
  return (
    <div>
    <Dialog
      className="dialog insertDialog"
      title="Add a new Giveaway"
      titleStyle={titleStyle}
      bodyStyle={{ width:"105%", padding:"0 5% 0 0", backgroundColor: "rgb(224, 224, 224)" }}
      actions={actionBtns}
      actionsContainerStyle={actionsContainerStyle}
      modal={true}
      open={this.state.isOpen}
      onRequestClose={this.handleClose}
      autoScrollBodyContent={true}
      autoDetectWindowHeight={false}>

      <Paper style={paperStyle}>
        <Formsy.Form
          className="add-giveaway-form"
          onValid={ ()=> this.setState({ canSubmit: true }) }
          onInvalid={()=> this.setState({ canSubmit: false }) }
          onValidSubmit={this.submitForm}
          onInvalidSubmit={ model => console.error('Form error:', model) }>
            <Row>
              <Col xs={12}>
                <h2>What</h2>
              </Col>
              <Col xs={12}>
                <FormsyText
                  name="title"
                  fullWidth={true}
                  required
                  floatingLabelText="Event Name"
                  hintText="What is name of the event?"
                  value={this.state.title}
                  onBlur={ e => this.setState({title: e.target.value}) } />
              </Col>
              <Col xs={12}>
                <FormsyText
                  name="description"
                  floatingLabelText="Description"
                  multiLine={true}
                  fullWidth={true}
                  rows={3}
                  required
                  hintText="What is the event about?"
                  value={this.state.description}
                  onBlur={ e => this.setState({description: e.target.value}) } />
              </Col>
              <Col xs={12}>
                <FormsyText
                  name="website"
                  fullWidth={true}
                  floatingLabelText="Website"
                  hintText="Website URL"
                  value={this.state.website}
                  onBlur={ e => this.setState({website: e.target.value}) } />
              </Col>
            </Row>

            <Row style={{ paddingTop: 21 }}>
              <Col xs={12}>
                <h2>When</h2>
              </Col>
              <Col xs={8} md={4}>
                <FormsyDate
                  required
                  className="DatePicker"
                  name="dateStart"
                  formatDate={this.formatDate}
                  floatingLabelText="Start Date"
                  autoOk={true}
                  minDate={new Date()}
                  onChange={ (e, date) => this.setState({startDate: date, endDate: date}) }
                  value={this.state.startDate} />
              </Col>
              <Col xs={4} md={2}>
                <FormsyTime
                  required
                  className="TimePicker"
                  name="startTime"
                  pedantic={true}
                  format="ampm"
                  floatingLabelText="Start Time"
                  onChange={ (e, date) => this.setState({startTime: date}) }
                  value={this.state.startTime} />
              </Col>
              <Col xs={8} md={4}>
                <FormsyDate
                  className="DatePicker"
                  name="dateEnd"
                  formatDate={this.formatDate}
                  floatingLabelText="End Date"
                  autoOk={true}
                  minDate={new Date()}
                  onChange={ (e, date) => this.setState({endDate: date}) }
                  value={this.state.endDate} />
              </Col>
              <Col xs={4} md={2}>
                <FormsyTime
                  className="TimePicker"
                  name="endTime"
                  required
                  pedantic={true}
                  format="ampm"
                  floatingLabelText="End Time"
                  onChange={ (e, date) => this.setState({endTime: date}) }
                  value={this.state.endTime}
                  defaultTime={ moment().set('minute', 0).toDate() } />
              </Col>
            </Row>

            <Row style={{ paddingTop: 21 }}>
              <Col xs={12} md={8}>
                <h2>Where</h2>
              </Col>

              <Col xs={12} md={4} style={{ paddingTop: 21 }}>
                <RaisedButton
                  className="formBtn"
                  secondary={true}
                  onTouchTap={this.handleAddLocation}
                  label="Choose on Map"
                  icon={ IconsHelper.materialIcon("add_location") } />
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <AutoComplete
                  name="location"
                  hintText="Location of event"
                  dataSource={this.state.dataSource}
                  onUpdateInput={this.geocodeInputLoc}
                  onNewRequest={this.handleLocationSelect}
                  floatingLabelText="Location"
                  fullWidth={true}
                  openOnFocus={true}
                  searchText={this.state.location}
                  filter={AutoComplete.noFilter}/>
              </Col>
              <Col className="displayNone">
                <FormsyText
                  name="lat"
                  validations="isNumeric"
                  validationError={numericError}
                  required
                  value={this.state.latLng.lat}
                  disabled={true} />
                <FormsyText
                  name="lng"
                  validations="isNumeric"
                  validationError={numericError}
                  required
                  value={this.state.latLng.lng}
                  disabled={true} />
              </Col>
            </Row>

            {this.state.latLng.lat ?
              <Row>
                <Col xs={12}>
                  <LeafletMapPreview
                    previewCoords={ this.state.latLng }
                    previewZoom={ this.state.zoom } />
                </Col>
              </Row>
              :
              <div />
            }

            <Row style={{ paddingTop: 21 }}>
              <Col xs={12} md={8} >
                <h2>Categories</h2>
              </Col>
              <Col xs={12} md={4} style={{ paddingTop: 21 }}>
                <RaisedButton
                  className="formBtn"
                  label={this.state.childCatName}
                  secondary={true}
                  onTouchTap={this.handleOpenCatMenu}
                  icon={<FontIcon className={this.state.childCatIcon} />} />
                <AllCategoriesList
                  setParentCat={this.setParentCat}
                  setChildCat={this.setChildCat}
                  isCatMenuOpen={this.state.isCatMenuOpen}
                  anchorEl={this.state.anchorEl}
                  closeCatMenu={ e => this.setState({ isCatMenuOpen: false }) } />
              </Col>
              <Col className="displayNone">
              <FormsyText
                name="childCatRequired"
                value={this.state.childCatIcon}
                required />
              </Col>
              <Col xs={12} md={12}>
                <TagsInput
                  value={this.state.tags}
                  onChange={ tags => this.setState({tags}) } />
              </Col>
            </Row>

            <Row style={{ paddingTop: 21 }}>
              <Col xs={12} >
                <h2>Communities</h2>
              </Col>
              <Col xs={12} >
                <IncludedCommunities
                  value={ this.state.commIdsVal }
                  options={ this.state.commIdsOpt }
                  setOptVal= { (opt,val) => this.setState({ commIdsOpt:opt, commIdsVal:val }) }
                  handleChange = { commIdsVal => this.setState({ commIdsVal }) } />
              </Col>
            </Row>

            <Row style={{ paddingTop: 21 }}>
              <Col xs={12} md={8} >
              <h2>Upload Image</h2>
              </Col>
              <Col xs={12} md={4} style={{ paddingTop: 21 }} >
                <RaisedButton
                className="formBtn"
                secondary={true}
                icon={ IconsHelper.materialIcon("backup") }
                label="Choose an Image"
                >
                <input
                type="file"
                accept="image/*"
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  width: '100%',
                  opacity: 0,
                  zIndex: 1,
                }}
                onChange={this.handleUpload} />
                </RaisedButton>
              </Col>
            </Row>
            <Row style={{ paddingBottom: 21 }}>
              <Col xs={12}>
                {this.state.loadingFile?
                  <LinearProgress mode="indeterminate" id="LinearProgressEdit"/>
                  :
                  <div />
                }
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
              }}>


              {this.state.tile?
                  <GridList
                  cellHeight={300}
                  cols={2}
                  style={{
                    width: '100%',
                    height: 'auto',
                    overflowY: 'auto',
                    marginBottom: 24,
                    paddingLeft:"15px",
                    paddingRight:"15px"
                  }}
                  >
                    <GridTile
                    key={this.state.tile.res.secure_url}
                    title={this.state.tile.files[0].name}
                    cols={2} >
                      <img src={this.state.tile.res.secure_url} />
                    </GridTile>
                  </GridList>
                  :
                  <div />
                }
                </div>
              </Col>
            </Row>

        </Formsy.Form>
      </Paper>
    </Dialog>
    <RemoveGiveawayDialog
      open={ this.state.removeGiveawayPromptOpen }
      handleClose={ event => this.setState({ removeGiveawayPromptOpen: false }) }
      handleSubmit={ this.removeGiveaway.bind(this) } />
    </div>
  )}
};
