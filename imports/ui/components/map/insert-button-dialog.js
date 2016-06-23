import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import TimePicker from 'material-ui/TimePicker';
import AutoComplete from 'material-ui/AutoComplete';


import Formsy from 'formsy-react';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup, FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';
import { Grid, Row, Col } from 'react-bootstrap';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Download from 'material-ui/svg-icons/file/file-download';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import AllCategoriesList from '../../containers/all-categories-list.js' 
import TagsInput from 'react-tagsinput';

import { insertGiveaway } from '../../../api/giveaways/methods.js';
import { insertStatus } from '../../../api/status-updates/methods.js';
import { StatusTypes } from '../../../api/status-types/status-types.js'

import { geocode } from '../../../api/geocode/methods.js';
import { shortId } from '../../../util/helper.js'

/**
* Dialog content can be scrollable.
*/  
export default class InsertBtnDialog extends React.Component {

  constructor(props){

    super(props);
    this.initialState = {
      canSubmit: false,
      open: props.openModal,
      tags: [],
      parentCatId: "",
      childCatId: "",
      childCatName:"Select Category",
      title:"",
      description:"",
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      lat:"",
      lng:"",
      location:"",
      recurring: false,
      dataSource: [],
    };

    this.state=this.initialState;

    this.geocodeInputLoc = (value) => {
      if(value.length > 5){
        geocode(Meteor.settings.public.MapBox.accessToken, value, (locObjs) => {
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
      this.setState({location: value})
    }

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
      }

    };
    
    this.handleTagsChange = (tags) => {
      this.setState({tags})
    };
    
    this.handleOpen = () => {
      this.setState({open: true});
    };
    
    this.handleClose = () => {
      this.setState({open: false});
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
    }

    this.setParentCat = (e, val) => {
      this.setState({parentCatId: val.key});
    };
    this.setChildCat = (e,val) => {
      this.setState({childCatId: e.currentTarget.getAttribute("id")});
      this.setState({childCatName: e.currentTarget.getAttribute("name")});
    };

    this.submitForm = () => {
      event.preventDefault();
      this.setState({open: false});
      console.log("state", this.state);
      let data = this.state;
      data.title = String(data.title);
      data.description = String(data.description);
      data.location = String(data.location);
      data.lng = parseFloat(data.lng);
      data.lat = parseFloat(data.lat);
      data.userId = String(Meteor.userId());
      data.batchId = shortId.generate();
      console.log("state", data);


      let startHr= data.startTime.getHours();
      let startMin= data.startTime.getMinutes();
      let startDateTime = moment(data.startDate).set('hour', startHr).set('minute',startMin).toDate();
      let endHr= data.endTime.getHours();
      let endMin= data.endTime.getMinutes();
      // check if no end date or earlier than start datetime
      let endDateTime = null;
      if(data.endDate === null){
        endDateTime = startDateTime;
      } else {
        endDateTime = moment(data.endDate).set('hour', endHr).set('minute',endMin).toDate();
        endDateTime = endDateTime > startDateTime ? endDateTime : startDateTime;
      } 
      if(!data.recurring){
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
          batchId: data.batchId
        }

        const gaId = insertGiveaway.call(ga, (error)=>{
          if (error) {
            Bert.alert(error.reason, 'Error adding Giveaway');
          } else {
            this.setState(this.initialState);
            Bert.alert('Giveaway Added!', 'success');
          }
        })

        let availableStatus = StatusTypes.findOne({relativeOrder: 10});
        insertStatus.call({
          giveawayId:   gaId,
          statusTypeId: availableStatus._id,
          date:         new Date(),
          userId:       data.userId,
        },(error)=>{
          if (error) {
            Bert.alert(error.reason, 'Error adding Giveaway');
          } else {
            this.state = this.initialState;
            Bert.alert('Giveaway Added!', 'success');
          }
        })

      }else{
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
            batchId: data.batchId
          }

          const gaId = insertGiveaway.call(ga, (error)=>{
            if (error) {
              Bert.alert(error.reason, 'Error adding Giveaway');
            } else {
              this.setState(this.initialState);
              Bert.alert('Giveaway Added!', 'success');
            }
          })

          let availableStatus = StatusTypes.findOne({relativeOrder: 10});
          insertStatus.call({
            giveawayId:   gaId,
            statusTypeId: availableStatus._id,
            date:         new Date(),
            userId:       data.userId,
          },(error)=>{
            if (error) {
              Bert.alert(error.reason, 'Error adding Giveaway');
            } else {
              Bert.alert('Giveaway Added!', 'success');
            }
          })

        }
      } 
    }
}
render() {
  let { paperStyle, switchStyle, submitStyle, gridStyle, titleStyle, dialogStyle, actionsContainerStyle, toggle, labelStyle, textFieldStyle } = this.styles;
  let { wordsError, numericError, urlError } = this.errorMessages;
  const actionBtns = [
    // Submit Button 
    <FlatButton
      label="Submit"
      primary={true}
      disabled={!this.state.canSubmit}
      onTouchTap={this.submitForm}
      autoScrollBodyContent={true}
      />,
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleClose}
      />,
  ];
  return (
    
    <div>
      {/* + Button */}
      <FloatingActionButton 
        className="floatingButton" 
        onTouchTap={this.handleOpen} >
        <ContentAdd />
      </FloatingActionButton>
      <Dialog
        title="Add a new Giveaway"
        titleStyle={titleStyle}
        bodyStyle={dialogStyle}
        actions={actionBtns}
        actionsContainerStyle={actionsContainerStyle}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
        >
        <Paper style={paperStyle}>        

          <Formsy.Form
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            onValidSubmit={this.submitForm}
            onInvalidSubmit={this.notifyFormError}
            >
            <Grid style={gridStyle}>
              <Row>
                <h2>What</h2>
                <Col >
                  <FormsyText 
                  name="title"
                  fullWidth={true} 
                  required
                  hintText="What is name of the event?"
                  onChange={this.handleTitle}
                  />
                </Col>
              </Row>
              <Row>
                <Col >
                <FormsyText 
                  name="description"
                  floatingLabelText="Description" 
                  multiLine={true} 
                  fullWidth={true} 
                  rows={3} 
                  required
                  hintText="What is the event about?"
                  onChange={this.handleDescription}
                  />
                </Col>
                <Col xs={12} md={4} >
                  <p style={{"fontSize":"18px", "position":"relative","display": "inlineBlock"}}>{this.state.childCatName}</p>
                  <AllCategoriesList setParentCat={this.setParentCat} setChildCat={this.setChildCat}/>
                </Col>
                <Col xs={12} md={8} style={{"paddingBottom":"10px"}}>
                  <TagsInput value={this.state.tags} onChange={this.handleTagsChange} />
                </Col>
              </Row>
              <br />
              <Row>
                <h2>When</h2>
                <Col xs={12} md={8}>
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
                    value ={this.state.startDate}

                    />
                </Col>
                <Col xs={6} md={2} >
                  <FormsyTime 
                    required
                    className="TimePicker"
                    name="startTime"
                    pedantic={true} 
                    format="ampm" 
                    floatingLabelText="Start Time"
                    textFieldStyle={this.dateTimeTextStyle}
                    onChange={this.handleChangeStartTimePicker12}
                    value ={this.state.startTime}
                    />
                </Col>
                <Col xs={6} md={2} className={!this.state.recurring? "" : "displayNone"}>
                  <FormsyTime 
                  className="TimePicker"
                  name="endTime"
                  required
                  pedantic={true} 
                  format="ampm" 
                  floatingLabelText="End Time"
                  textFieldStyle={this.dateTimeTextStyle}
                  onChange={this.handleChangeEndTimePicker12}
                  value ={this.state.endTime}
                  defaultTime = { moment().set('minute',0).toDate() }
                  />
                </Col>
              </Row>
              <Row className={this.state.recurring? "" : "displayNone"}>
                <Col xs={12} md={8} >
                  <FormsyDate 
                  className="DatePicker"
                  name="dateEnd"
                  formatDate={this.formatDate} 
                  floatingLabelText="End Date" 
                  autoOk={true}
                  minDate={new Date()}
                  textFieldStyle={this.dateTimeTextStyle}
                  onChange={this.handleEndDatePicker}
                  value ={this.state.endDate}
                  />                
                </Col>
                <Col xs={6} md={2} >
                  <FormsyTime 
                  className="TimePicker"
                  name="endTime"
                  required
                  pedantic={true} 
                  format="ampm" 
                  floatingLabelText="End Time"
                  textFieldStyle={this.dateTimeTextStyle}
                  onChange={this.handleChangeEndTimePicker12}
                  value ={this.state.endTime}
                  defaultTime = { moment().set('minute',0).toDate() }
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6} >
                <FormsyToggle
                className="toggle"
                label="Repeated Event?"
                name= "Recurring"
                labelStyle={this.labelStyle}
                onChange={this.handleRecurring}
                toggled={this.state.recurring}
                />
                </Col>
              </Row>
              <br />

              <Row>
                <h2>Where</h2>

                <Col xs={12} md={8}>
                <AutoComplete
                name="location"
                hintText="Location of event"
                dataSource={this.state.dataSource}
                onUpdateInput={this.geocodeInputLoc}
                onNewRequest={this.handleLocationSelect}
                floatingLabelText="Location"
                fullWidth={true}
                openOnFocus={true}
                filter={AutoComplete.noFilter}
                />
                </Col>
                <Col xs={12} md={2} >
                <FormsyText
                name="lat"
                validations="isNumeric"
                validationError={numericError}
                hintText="Latitude"
                floatingLabelText="Latitude"
                value={this.state.lat}
                onChange={this.handleLat}
                disabled={true}
                />
                </Col>
                <Col xs={12} md={2} >
                <FormsyText
                name="lng"
                validations="isNumeric"
                validationError={numericError}
                hintText="Longitude"
                floatingLabelText="Longitude"
                value={this.state.lng}
                onChange={this.handleLng}
                disabled={true}
                />
                </Col>
              </Row>

            </Grid>
            
          </Formsy.Form>
        </Paper>

      </Dialog>
    </div>    
    );
  }
};
