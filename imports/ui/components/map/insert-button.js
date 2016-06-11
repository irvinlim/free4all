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
    
/**
* Dialog content can be scrollable.
*/
export default class InsertBtnDialog extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      canSubmit: false,
      open: false,
      
      title: "",
      description: "",
      
    };
    this.errorMessages ={
      wordsError: "Please only use letters",
      numericError: "Please provide a number",
      urlError: "Please provide a valid URL",
    };

    this.styles = {
      paperStyle: {
        width: "80%",
        margin: 'auto',
        padding: 20,
      },
      gridStyle: {
        width: "inherit"
      },
      titleStyle: {
        fontWeight: 100,
        textTransform: "uppercase",
        textAlign: "center"
      },
      switchStyle: {
        marginBottom: 16,
      },
      submitStyle: {
        marginTop: 32,
      },
    };
    
    this.handleOpen = () => {
      this.setState({open: true});
    };
    
    this.handleClose = () => {
      this.setState({open: false});
    };
    
    this.enableButton = () => {
      this.setState({ canSubmit: true });
    }

    this.disableButton = () => {
      this.setState({ canSubmit: false });
    }

    this.submitForm = (data) => {
      console.log(data);
      
      alert(JSON.stringify(data, null, 4));
    }

    this.notifyFormError = (data) => {
      console.error('Form error:', data);
    }
    this.formatDate = (date) => {
      return moment(date).format("dddd, Do MMM YYYY");
    };
    this.handleTitle = (e)  => {
      this.setState({title: e.target.value});
    };
    this.handleDescription = (e)  => {
      this.setState({description: e.target.value});
    };
    this.handleDatePicker = (e, date) => {
      this.setState({date: date});
    };
    this.handleChangeStartTimePicker12 = (e, date) => {
      this.setState({startTime: date});
    };
    this.handleChangeEndTimePicker12 = (e, date) => {
      this.setState({endTime: date});
    };
    
  }

render() {
  let { paperStyle, switchStyle, submitStyle, gridStyle, titleStyle } = this.styles;
  let { wordsError, numericError, urlError } = this.errorMessages;
  const actions = [
    // Submit Button 
    <FlatButton
      label="Submit"
      primary={true}
      keyboardFocused={!this.state.canSubmit}
      disabled={!this.state.canSubmit}
      onTouchTap={this.handleClose}
      autoScrollBodyContent={true}
      onRequestClose={this.submitForm}
      />,
    <FlatButton
      label="Cancel"
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
        actions={actions}
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
              <Row >
                <Col xs={12} md={12}>
                <FormsyText 
                  name="title"
                  floatingLabelText="Title" 
                  onChange={this.handleTitle} 
                  validations="isWords"
                  validationError={wordsError}
                  fullWidth={true} 
                  required
                  hintText="What is title of the giveaway?"
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                <FormsyText 
                  name="description"
                  floatingLabelText="Description" 
                  multiLine={true} 
                  fullWidth={true} 
                  rows={3} 
                  required
                  onChange={this.handleDescription.bind(this)} 
                  validations="isWords"
                  validationError={wordsError}
                  hintText="What is the giveaway about?"
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormsyDate 
                    id="datepick" 
                    required
                    name="date"
                    formatDate={this.formatDate} 
                    floatingLabelText="Date" 
                    mode="landscape" />
                </Col>
                <Col md={6} >
                <FormsyText
                  name="url"
                  validations="isUrl"
                  validationError={urlError}
                  hintText="http://www.example.com"
                  floatingLabelText="Link (Optional)"
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} >
                  <FormsyTime 
                    required
                    name="startTime"
                    pedantic={true} 
                    format="ampm" 
                    floatingLabelText="Start Time"
                    />
                </Col>
                <Col md={6} >
                  <FormsyTime 
                    name="endTime"
                    required
                    pedantic={true} 
                    format="ampm" 
                    floatingLabelText="End Time"
                    />
                </Col>
              </Row>
            
            {/* 
              <RaisedButton
              style={submitStyle}
              type="submit"
              label="Submit"
              disabled={!this.state.canSubmit}
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
