import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import TimePicker from 'material-ui/TimePicker';

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

/**
* Dialog content can be scrollable.
*/  
export default class InsertBtnDialog extends React.Component {

  constructor(props){

    super(props);
    this.initialState = {
      canSubmit: false,
      open: false,
      tags: [],
      parentCatId: "",
      childCatId: "",
      childCatName:"",
      title:"",
      description:"",
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      lat:"",
      lng:"",
      location:"",
    };

    this.state=this.initialState;

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
        marginBottom: 16,
      },
      submitStyle: {
        marginTop: 32,
      },
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
      this.setState({startDate: date});
    };
    this.handleEndDatePicker = (e, date) => {
      this.setState({endDate: date});
    };
    this.handleChangeStartTimePicker12 = (e, date) => {
      this.setState({startTime: date});
    };
    this.handleChangeEndTimePicker12 = (e, date) => {
      this.setState({endTime: date});
    };


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
      console.log("state", this.state);

      if(data.endDate===null){
        const startHr= data.startTime.getHours();
        const startMin= data.startTime.getMinutes();
        const startDateTime = moment(data.startDate).set('hour', startHr).set('minute',startMin).toDate();
        const endHr= data.endTime.getHours();
        const endMin= data.endTime.getMinutes();
        let endDateTime = moment(data.startDate).set('hour', endHr).set('minute',endMin).toDate();
        endDateTime = endDateTime > startDateTime ? endDateTime : startDateTime;

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
        }
        console.log("ga", ga);

        const gaId = insertGiveaway.call(ga, (error)=>{
          if (error) {
            Bert.alert(error.reason, 'Error adding Giveaway');
          } else {
            this.state = this.initialState;
            Bert.alert('Document added!', 'Added Giveaway');
          }
        })

        console.log("gaId", gaId);
        insertStatus.call({
          giveawayId:   gaId,
          statusTypeId: "AwfAiiyjeJPHXorz5",
          date:         new Date(),
          userId:       data.userId,
        },(error)=>{
          if (error) {
            Bert.alert(error.reason, 'Error adding Giveaway');
          } else {
            this.state = this.initialState;
            Bert.alert('Document added!', 'Added Giveaway');
          }
        })

      }else{
        // let numberOfDays = moment(data.endDate).diff(moment(data.startDate),'days')+1;
        // for(let i = 0; i<numberOfDays; i++){
        //   const startHr= data.startTime.getHours();
        // const startMin= data.startTime.getMinutes();
        // const startDateTime = moment(data.startDate).set('hour', startHr).set('minute',startMin).toDate();
        // const endHr= data.endTime.getHours();
        // const endMin= data.endTime.getMinutes();
        // const endDateTime = moment(data.startDate).set('hour', endHr).set('minute',endMin).toDate();

        // const ga = {
        //   title: String(data.title),
        //   description: String(data.description),
        //   startDateTime: startDateTime,
        //   endDateTime: endDateTime,
        //   location: data.location,
        //   coordinates: [parseFloat(data.lng),parseFloat(data.lat)],
        //   categoryId: data.childCatId,
        //   tags: data.tags,
        //   userId: String(Meteor.userId)
        // }

        // const gaId = insertGiveaway.call(ga, (error)=>{
        //   if (error) {
        //     Bert.alert(error.reason, 'Error adding Giveaway');
        //   } else {
        //     this.state = this.initialState;
        //     Bert.alert('Document added!', 'Added Giveaway');
        //   }

        // })

      } 
      
    }
  }
render() {
  let { paperStyle, switchStyle, submitStyle, gridStyle, titleStyle, dialogStyle, actionsContainerStyle } = this.styles;
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
                <Col >
                  <FormsyText 
                  name="title"
                  floatingLabelText="Title" 
                  fullWidth={true} 
                  required
                  hintText="What is title of the giveaway?"
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
                  hintText="What is the giveaway about?"
                  onChange={this.handleDescription}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                  <FormsyDate 
                    required
                    name="dateStart"
                    formatDate={this.formatDate} 
                    floatingLabelText="Start Date" 
                    autoOk={true}
                    minDate={new Date()}
                    onChange={this.handleStartDatePicker}

                    />
                </Col>
                <Col xs={12} md={6}>
                  <FormsyDate 
                  name="dateEnd"
                  formatDate={this.formatDate} 
                  floatingLabelText="End Date (Optional - Recurring)" 
                  autoOk={true}
                  minDate={new Date()}
                  onChange={this.handleEndDatePicker}
                  />                
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6} >
                  <FormsyTime 
                    required
                    name="startTime"
                    pedantic={true} 
                    format="ampm" 
                    floatingLabelText="Start Time"
                    onChange={this.handleChangeStartTimePicker12}
                    />
                </Col>
                <Col xs={12} md={6} >
                  <FormsyTime 
                    name="endTime"
                    required
                    pedantic={true} 
                    format="ampm" 
                    floatingLabelText="End Time"
                    onChange={this.handleChangeEndTimePicker12}
                    />
                </Col>
              </Row>
              <Row>
                <Col>
                <FormsyText
                  name="location"
                  hintText="Where is it?"
                  fullWidth={true} 
                  floatingLabelText="Location"
                  onChange={this.handleLocation}

                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6} >
                  <FormsyText
                    name="lat"
                    validations="isNumeric"
                    validationError={numericError}
                    hintText="Latitude"
                    floatingLabelText="Latitude"
                  onChange={this.handleLat}

                    />
                </Col>
                <Col xs={12} md={6} >
                  <FormsyText
                    name="lng"
                    validations="isNumeric"
                    validationError={numericError}
                    hintText="Longitude"
                    floatingLabelText="Longitude"
                  onChange={this.handleLng}

                    />
                </Col>
              </Row>
              <Row>
                <br />
                Select Category {this.state.childCatName}<AllCategoriesList setParentCat={this.setParentCat} setChildCat={this.setChildCat}/>
                <br />
              </Row>  
              <Row>
                <TagsInput value={this.state.tags} onChange={this.handleTagsChange} />
              </Row>
            {/* 
              <RaisedButton
              style={submitStyle}
              type="submit"
              label="Submit"
              disabled={!this.state.canSubmit}
              />
              
              <Row>
                <Col >
                <FormsyText
                name="url"
                validations="isUrl"
                validationError={urlError}
                hintText="http://www.example.com"
                floatingLabelText="Link (Optional)"
                onChange={this.handleURL}
                />
                </Col>
              </Row>
              
              
              
              <FormsySelect
                name="frequency"
                required
                floatingLabelText="How often do you?"
                menuItems={this.selectFieldItems}
                >
                <MenuItem value={'never'} primaryText="Never" />
                <MenuItem value={'nightly'} primaryText="Every Night" />
                <MenuItem value={'weeknights'} primaryText="Weeknights" />
              </FormsySelect>
              <FormsyText
                name="name"
                validations="isWords"
                validationError={wordsError}
                required
                hintText="What is your name?"
                floatingLabelText="Name"
                />
              <FormsyText
                name="age"
                validations="isNumeric"
                validationError={numericError}
                hintText="Are you a wrinkly?"
                floatingLabelText="Age (optional)"
                />
              <FormsyText
                name="url"
                validations="isUrl"
                validationError={urlError}
                required
                hintText="http://www.example.com"
                floatingLabelText="URL"
                />
              <FormsySelect
                name="frequency"
                required
                floatingLabelText="How often do you?"
                menuItems={this.selectFieldItems}
                >
                <MenuItem value={'never'} primaryText="Never" />
                <MenuItem value={'nightly'} primaryText="Every Night" />
                <MenuItem value={'weeknights'} primaryText="Weeknights" />
              </FormsySelect>
              <FormsyDate
                name="date"
                required
                floatingLabelText="Date"
                />
              <FormsyTime
                name="time"
                required
                floatingLabelText="Time"
                />
              <FormsyCheckbox
                name="agree"
                label="Do you agree to disagree?"
                style={switchStyle}
                />
              <FormsyToggle
                name="toggle"
                label="Toggle"
                style={switchStyle}
                />
              <FormsyRadioGroup name="shipSpeed" defaultSelected="not_light">
                <FormsyRadio
                  value="light"
                  label="prepare for light speed"
                  style={switchStyle}
                  />
                <FormsyRadio
                  value="not_light"
                  label="light speed too slow"
                  style={switchStyle}
                  />
                <FormsyRadio
                  value="ludicrous"
                  label="go to ludicrous speed"
                  style={switchStyle}
                  disabled={true}
                  />
              </FormsyRadioGroup>
              
              */}
            </Grid>
            
          </Formsy.Form>
        </Paper>

      </Dialog>
    </div>    
    );
  }
};
