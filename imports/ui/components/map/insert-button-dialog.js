import React from 'react';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AutoComplete from 'material-ui/AutoComplete';
import { Bert } from 'meteor/themeteorchef:bert';
import FontIcon from 'material-ui/FontIcon';
import {GridList, GridTile} from 'material-ui/GridList';
import LinearProgress from 'material-ui/LinearProgress';
import Formsy from 'formsy-react';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup, FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';
import { Grid, Row, Col } from 'react-bootstrap';
import TagsInput from 'react-tagsinput';

import AllCategoriesList from '../../containers/categories/all-categories-list';
import IncludedCommunities from '../../components/form/included-communities';
import LeafletMapPreview from './leaflet-map-preview';
import { geocode } from '../../../util/geocode.js';
import { shortId, sanitizeURL } from '../../../util/helper.js';
import * as IconsHelper from '../../../util/icons';

import { insertGiveaway } from '../../../api/giveaways/methods.js';
import { StatusTypes } from '../../../api/status-types/status-types.js';

export default class InsertBtnDialog extends React.Component {

  constructor(props){
    super(props);

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
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      lat: "",
      lng: "",
      location:"",
      recurring: false,
      dataSource: [],
      isCatMenuOpen: false,
      tile: null,
      avatarId: "",
      loadingFile: false,
      zoom: 1,
      commIdsVal: [],
      commIdsOpts: []
    };

    this.state = this.initialState;

    this.handleAddLocation = () => {
      props.closeModal();
      props.addDraggable();
      props.hideMarkers();
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
        lat: loc.center[1],
        lng: loc.center[0],
        location: loc.place_name
      })
    };

    this.errorMessages ={
      wordsError: "Please only use letters",
      numericError: "Please provide a number",
      urlError: "Please provide a valid URL",
    };

    this.styles = {
      dialogStyle:{
        backgroundColor: "rgb(224, 224, 224)",
      },
      actionsContainerStyle:{
        backgroundColor: "rgb(224, 224, 224)",
      },
      paperStyle: {
        width: "95%",
        margin: 'auto',
        padding: 20,
      },
      gridStyle: {
        width: "inherit"
      },
      titleStyle: {
        fontWeight: 100,
        fontSize: "18px",
        textTransform: "uppercase",
        textAlign: "center",
        backgroundColor: "rgb(224, 224, 224)",
      },
      switchStyle: {
        "marginBottom": "16",
      },
      submitStyle: {
        "marginTop": "32",
      },
      textFieldStyle: {
        pointerEvents: "none",
      },
    };

    this.handleTagsChange = (tags) => {
      this.setState({tags})
    };

    this.handleOpen = () => {
      props.openModal();

      let dateOnLoad = new Date();
      dateOnLoad.setMinutes(0,0,0);
      let date1hAfter = moment(dateOnLoad).add(1,'h').toDate();

      this.setState({
        startTime: dateOnLoad,
        endTime: date1hAfter
      })
    };

    this.handleClose = () => {
      props.closeModal();
      this.setState({ isCatMenuOpen: false });
    };

    this.enableButton = () => {
      this.setState({ canSubmit: true });
    };

    this.disableButton = () => {
      this.setState({ canSubmit: false });
    };

    this.notifyFormError = (model) => {
      console.error('Form error:', model);
    };

    this.formatDate = (date) => {
      return moment(date).format("dddd, Do MMM YYYY");
    };

    this.handleTitle = (e)  => {
      this.setState({title: e.target.value});
    };
    this.handleDescription = (e)  => {
      this.setState({description: e.target.value});
    };
    this.handleWebsite = (e)  => {
      this.setState({website: e.target.value});
    };
    this.handleLocation = (e)  => {
      this.setState({location: e.target.value});
    };
    this.handleLat = (e)  => {
      this.setState({lat: e.target.value});
    };
    this.handleLng = (e)  => {
      this.setState({lng: e.target.value});
    };
    this.handleStartDatePicker = (e, date) => {
      this.setState({startDate: date, endDate: date});
    };
    this.handleEndDatePicker = (e, date) => {
      this.setState({endDate: date});
    };
    this.handleChangeStartTimePicker12 = (e, date) => {
      this.setState({startTime: date, endTime: date});
    };
    this.handleChangeEndTimePicker12 = (e, date) => {
      this.setState({endTime: date});
    };
    this.handleRecurring = (e,val) => {
      this.setState({recurring: val});
    };

    this.setParentCat = (parentCat) => {
      this.setState({ parentCatId: parentCat._id });
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

    this.submitForm = () => {
      event.preventDefault();
      props.closeModal();
      props.stopDraggableAdded();
      props.resetLoc();

      let data = this.state;
      data.title = String(data.title);
      data.description = String(data.description);
      data.website = data.website ? sanitizeURL(data.website) : "";
      data.location = String(data.location);
      data.lng = parseFloat(data.lng);
      data.lat = parseFloat(data.lat);
      data.userId = props.user._id;
      data.removeUserId = props.user._id;
      data.inclCommIds = data.commIdsVal.map(comm => comm.value);

      if (data.tile){
        data.avatarId = data.tile.res.public_id;
        const imgUrlPre = data.tile.res.secure_url;
        data.imgUrl = imgUrlPre.split('upload')[0]+ 'upload/' + 'h_300,c_scale' + imgUrlPre.split('upload')[1];
      }

      let startHr= data.startTime.getHours();
      let startMin= data.startTime.getMinutes();
      let startDateTime = moment(data.startDate).set('hour', startHr).set('minute',startMin).toDate();
      let endHr= data.endTime.getHours();
      let endMin= data.endTime.getMinutes();

      let availableStatus = StatusTypes.findOne({ relativeOrder: 0 });

      // check if no end date or earlier than start datetime
      let endDateTime = null;
      if (data.endDate === null){
        endDateTime = startDateTime;
      } else {
        endDateTime = moment(data.endDate).set('hour', endHr).set('minute',endMin).toDate();
        endDateTime = endDateTime > startDateTime ? endDateTime : startDateTime;
      }

      const ga = {
        title: data.title,
        description: data.description,
        website: data.website,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        location: data.location,
        coordinates: [data.lng, data.lat],
        categoryId: data.childCatId,
        tags: data.tags,
        userId: data.userId,
        statusUpdates: [{ statusTypeId: availableStatus._id, date: new Date(), userId: data.userId }],
        avatarId: data.avatarId,
        inclCommIds: data.inclCommIds,
      }

      const gaId = insertGiveaway.call(ga, (error)=>{
        if (error) {
          Bert.alert(error.reason, 'Error adding Giveaway');
        } else {
          this.setState(this.initialState);
          Bert.alert('Giveaway Added!', 'success');
        }
      })

    }
  }

componentWillReceiveProps(nextProps){
  this.setState({
    isOpen: nextProps.isModalOpen,
    lat: nextProps.latLng.lat,
    lng: nextProps.latLng.lng,
    location: nextProps.locName,
    dataSource: nextProps.locArr,
    zoom: nextProps.zoom,
  })
}

render() {
  let { paperStyle, switchStyle, submitStyle, gridStyle, titleStyle, dialogStyle, actionsContainerStyle, toggle, labelStyle, textFieldStyle, imgInputStyle} = this.styles;
  let { wordsError, numericError, urlError } = this.errorMessages;
  const actionBtns = [
    // Submit Button
    <FlatButton
      label="Submit"
      primary={true}
      disabled={!this.state.canSubmit}
      onTouchTap={this.submitForm}
      autoScrollBodyContent={true} />,
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleClose} />,
  ];
  return (

    <div>
      {/* + Button */}
      <FloatingActionButton className="floatingButton" onTouchTap={this.handleOpen}>
        { IconsHelper.materialIcon("add") }
      </FloatingActionButton>

      <Dialog
        className="dialog insertDialog"
        title="Add a new Giveaway"
        titleStyle={titleStyle}
        bodyStyle={dialogStyle}
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
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            onValidSubmit={this.submitForm}
            onInvalidSubmit={this.notifyFormError}>
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
                    onBlur={this.handleTitle} />
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
                    onBlur={this.handleDescription}
                    />
                </Col>
                <Col xs={12}>
                  <FormsyText
                    name="website"
                    fullWidth={true}
                    floatingLabelText="Website"
                    hintText="Website URL"
                    value={this.state.website}
                    onBlur={this.handleWebsite} />
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
                    textFieldStyle={this.dateTimeTextStyle}
                    minDate={new Date()}
                    onChange={this.handleStartDatePicker}
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
                    textFieldStyle={this.dateTimeTextStyle}
                    onChange={this.handleChangeStartTimePicker12}
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
                    textFieldStyle={this.dateTimeTextStyle}
                    onChange={this.handleEndDatePicker}
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
                    textFieldStyle={this.dateTimeTextStyle}
                    onChange={this.handleChangeEndTimePicker12}
                    value={this.state.endTime}
                    defaultTime={ moment().set('minute', 0).toDate() } />
                </Col>
              </Row>

              <Row style={{ paddingTop: 21 }}>
                <Col xs={12} sm={6} md={8}>
                  <h2>Where</h2>
                </Col>

                <Col xs={12} sm={6} md={4} style={{ paddingTop: 21 }}>
                  <RaisedButton
                    className="formBtn"
                    style={{minHeight:"41px"}}
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
                    hintText="Latitude"
                    required
                    floatingLabelText="Latitude"
                    value={this.state.lat}
                    onChange={this.handleLat}
                    disabled={true} />
                </Col>
                <Col className="displayNone">
                  <FormsyText
                    name="lng"
                    validations="isNumeric"
                    validationError={numericError}
                    hintText="Longitude"
                    required
                    floatingLabelText="Longitude"
                    value={this.state.lng}
                    onChange={this.handleLng}
                    disabled={true} />
                </Col>
              </Row>

              {this.state.lat ?
                <Row>
                  <Col xs={12}>
                    <LeafletMapPreview
                      previewCoords={ { lat:this.state.lat, lng:this.state.lng } }
                      previewZoom={this.state.zoom} />
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
                    style={{minHeight:"41px"}}
                    label={this.state.childCatName}
                    secondary={true}
                    onTouchTap={this.handleOpenCatMenu}
                    icon={<FontIcon className={this.state.childCatIcon} />} />
                  <AllCategoriesList
                    setParentCat={this.setParentCat}
                    setChildCat={this.setChildCat}
                    isCatMenuOpen={this.state.isCatMenuOpen}
                    anchorEl={this.state.anchorEl}
                    closeCatMenu={ e =>{ this.setState({ isCatMenuOpen: false }) } } />
                </Col>
                <Col className="displayNone">
                <FormsyText
                  name="childCatRequired"
                  value={this.state.childCatIcon}
                  required />
                </Col>
                <Col xs={12} md={12}>
                  <TagsInput value={this.state.tags} onChange={this.handleTagsChange} />
                </Col>
              </Row>

              <Row style={{ paddingTop: 21 }}>
                <Col xs={12} >
                  <h2>Communities</h2>
                </Col>
                <Col xs={12} >
                  <IncludedCommunities
                    user={ this.props.user }
                    value={ this.state.commIdsVal }
                    options={ this.state.commIdsOpt }
                    setOptVal= { (opt,val) => { this.setState({ commIdsOpt:opt, commIdsVal:val })}}
                    handleChange = { commIdsVal => { this.setState({ commIdsVal })} } />
                </Col>
              </Row>

              <Row style={{ paddingTop: 21 }}>
                <Col xs={12} md={8} >
                <h2>Upload Image</h2>
                </Col>
                <Col xs={12} md={4} style={{ paddingTop: 21 }} >
                  <RaisedButton
                  className="formBtn"
                  style={{minHeight:"41px"}}
                  secondary={true}
                  icon={ IconsHelper.materialIcon("backup") }
                  label="Choose an Image"
                  >
                  <input
                  type="file"
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
    </div>
    );
  }
};
