import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AutoComplete from 'material-ui/AutoComplete';
import { Bert } from 'meteor/themeteorchef:bert';
import FontIcon from 'material-ui/FontIcon';
import {GridList, GridTile} from 'material-ui/GridList';

import Formsy from 'formsy-react';
import Paper from 'material-ui/Paper';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup, FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';
import { Grid, Row, Col } from 'react-bootstrap';

import AllCategoriesList from '../../containers/all-categories-list.js'
import TagsInput from 'react-tagsinput';

import { insertGiveaway } from '../../../api/giveaways/methods.js';
import { StatusTypes } from '../../../api/status-types/status-types.js'

import { geocode } from '../../../api/geocode/methods.js';
import { shortId } from '../../../util/helper.js'

import * as IconsHelper from '../../../util/icons';

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
      imgUrl: ""
    };

    this.state = this.initialState;

    this.handleAddLocation = () => {
      props.closeModal();
      props.addDraggable();

      props.toggleMarkers();

      Bert.alert({
        hideDelay: 8000,
        title: 'Add Location',
        message: 'Drag marker to select location!',
        type: 'info',
        icon: 'fa-map-marker'
      });
    }

    this.geocodeInputLoc = (value) => {
      if(value.length > 5){
        geocode(Meteor.settings.public.MapBox.accessToken, value,
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
    this.setChildCat = (e) => {
      this.setState({childCatId: e.currentTarget.getAttribute("id")});
      this.setState({childCatName: e.currentTarget.getAttribute("name")});
      this.setState({childCatIcon: e.currentTarget.getAttribute("alt")});
      this.setState({ isCatMenuOpen: false });
    };

    this.handleOpenCatMenu = (e) => {
      e.preventDefault();
      this.setState({
        isCatMenuOpen: true,
        anchorEl: e.currentTarget
      });
    }

    this.handleCloseCatMenu(){
      this.setState({isCatMenuOpen: false})
    }

    this.handleUpload = (e) => {
      const self = this;
      const files = e.currentTarget.files;
      let tile = {};
      tile.files= files;


      // upload files to root cloudinary folder
      Cloudinary.upload(files, {}, function(err, res) {
        tile.res=res;
        self.setState({ tile: tile});
      });
    }

    this.submitForm = () => {
      event.preventDefault();
      props.closeModal();
      console.log("state", this.state);
      let data = this.state;
      data.title = String(data.title);
      data.description = String(data.description);
      data.location = String(data.location);
      data.lng = parseFloat(data.lng);
      data.lat = parseFloat(data.lat);
      data.userId = String(Meteor.userId());
      data.batchId = shortId.generate();
      const imgUrlPre = data.tile.res.secure_url;
      data.imgUrl = imgUrlPre.split('upload')[0]+ 'upload/' + 'h_300,c_scale' + imgUrlPre.split('upload')[1];
      console.log("state", data);

      let startHr= data.startTime.getHours();
      let startMin= data.startTime.getMinutes();
      let startDateTime = moment(data.startDate).set('hour', startHr).set('minute',startMin).toDate();
      let endHr= data.endTime.getHours();
      let endMin= data.endTime.getMinutes();

      let availableStatus = StatusTypes.findOne({relativeOrder: 10});

      // check if no end date or earlier than start datetime
      let endDateTime = null;
      if (data.endDate === null){
        endDateTime = startDateTime;
      } else {
        endDateTime = moment(data.endDate).set('hour', endHr).set('minute',endMin).toDate();
        endDateTime = endDateTime > startDateTime ? endDateTime : startDateTime;
      }

      if (!data.recurring){
        console.log("one giveaway")
        const ga = {
          title: data.title,
          description: data.description,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          location: data.location,
          coordinates: [data.lng, data.lat],
          categoryId: data.childCatId,
          tags: data.tags,
          userId: data.userId,
          batchId: data.batchId,
          statusUpdates: [{ statusTypeId: availableStatus._id, date: new Date(), userId: data.userId }],
          imgUrl: data.imgUrl,
        }

        const gaId = insertGiveaway.call(ga, (error)=>{
          if (error) {
            Bert.alert(error.reason, 'Error adding Giveaway');
          } else {
            this.setState(this.initialState);
            Bert.alert('Giveaway Added!', 'success');
          }
        })

      } else {
        // how many days recurring
        let numberOfDays = moment(data.endDate).diff(moment(data.startDate),'days')+1;
        console.log("Recurring", numberOfDays, "days");

        for(let i = 0; i<numberOfDays; i++){

          let newStartDateTime = moment(startDateTime).add(i, 'days').toDate();
          let newEndDateTime = moment(data.startDate).set('hour', endHr).set('minute',endMin).add(i, 'days').toDate();

          const ga = {
            title: data.title,
            description: data.description,
            startDateTime: newStartDateTime,
            endDateTime: newEndDateTime,
            location: data.location,
            coordinates: [data.lng, data.lat],
            categoryId: data.childCatId,
            tags: data.tags,
            userId: data.userId,
            batchId: data.batchId,
            statusUpdates: [{ statusTypeId: availableStatus._id, date: new Date(), userId: data.userId }],
            imgUrl: data.imgUrl,

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
    }
  }

componentWillReceiveProps(nextProps){
  this.setState({
    isOpen: nextProps.isModalOpen,
    lat: nextProps.latLng.lat,
    lng: nextProps.latLng.lng,
    location: nextProps.locName,
    dataSource: nextProps.locArr,
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
        className="insertDialog"
        title="Add a new Giveaway"
        titleStyle={titleStyle}
        bodyStyle={dialogStyle}
        actions={actionBtns}
        actionsContainerStyle={actionsContainerStyle}
        modal={false}
        open={this.state.isOpen}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}>

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
              </Row>

              <Row style={{ paddingTop: 21 }}>
                <Col xs={12} md={8}>
                  <h2>When</h2>
                </Col>
                <Col xs={12} md={4}>
                  <FormsyToggle
                  className="toggle"
                  label="Repeating event?"
                  name="Recurring"
                  labelStyle={this.labelStyle}
                  onChange={this.handleRecurring}
                  toggled={this.state.recurring} />
                </Col>

                <Col xs={12} md={8} sm={6}>
                  <FormsyDate
                    required
                    className="DatePicker"
                    name="dateStart"
                    formatDate={this.formatDate}
                    floatingLabelText={ this.state.recurring ? "Start Date" : "Date" }
                    autoOk={true}
                    textFieldStyle={this.dateTimeTextStyle}
                    minDate={new Date()}
                    onChange={this.handleStartDatePicker}
                    value={this.state.startDate} />
                </Col>
                <Col xs={6} md={2} sm={3}>
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
                <Col xs={6} md={2} sm={3} className={ this.state.recurring ? "displayNone" : "" }>
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

              <Row className={ this.state.recurring ? "" : "displayNone" }>
                <Col xs={12} md={8} sm={6}>
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
                <Col xs={6} md={2} sm={3}>
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
                    floatingLabelText="Longitude"
                    value={this.state.lng}
                    onChange={this.handleLng}
                    disabled={true} />
                </Col>
              </Row>

              <Row style={{ paddingTop: 21 }}>
                <Col xs={12} md={8} >
                  <h2>Categories</h2>
                </Col>
                <Col xs={12} md={4} style={{ paddingTop: 21 }}>
                  <RaisedButton 
                  label={this.state.childCatName} 
                  secondary={true} 
                  onTouchTap={this.handleOpenCatMenu}
                  icon={<FontIcon className={this.state.childCatIcon} />}
                />
                <AllCategoriesList 
                  setParentCat={this.setParentCat} 
                  setChildCat={this.setChildCat}
                  isCatMenuOpen={this.state.isCatMenuOpen}
                  anchorEl={this.state.anchorEl}
                  closeCatMenu={this.handleCloseCatMenu}
                />
                </Col>                
                <Col xs={12} md={12} style={{paddingBottom: "28px"}}>
                  <TagsInput value={this.state.tags} onChange={this.handleTagsChange} />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={8} >
                <h2>Upload Image</h2>
                </Col>
                <Col xs={12} md={4} 
                style={{ paddingTop: 21 }}
                >
                  <RaisedButton 
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
              
              <Row>
                <Col>
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
                      cols={2}
                      >
                      <img 
                      src={this.state.tile.res.secure_url} 
                      />
                      </GridTile>
                    </GridList>
                    :
                    <GridList>
                    </GridList>
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
