import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import TimePicker from 'material-ui/TimePicker';

/**
* Dialog content can be scrollable.
*/
export default class InsertBtnDialog extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      open: false,
      date: null,
      startTime: null,
      endTime: null,
      title: "",
      description: "",
      
    };
  }
  handleOpen() {
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
  };

  formatDate(date){
    return moment(date).format("dddd, Do MMM YYYY");
  };
  
  handleTitle(e) {
    this.setState({title: e.target.value});
  };
  handleDescription(e) {
    this.setState({description: e.target.value});
  };
  handleDatePicker(e, date){
    this.setState({date: date});
  };
  handleChangeStartTimePicker12(e, date){
    this.setState({startTime: date});
  };
  handleChangeEndTimePicker12(e, date){
    this.setState({endTime: date});
  };


  render() {
    const actions = [
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose.bind(this)}
        autoScrollBodyContent={true}
        onRequestClose={this.handleClose.bind(this)}
        />,
    ];

    return (
      <div>
        {/* + button */}
        <FloatingActionButton className="floatingButton" onTouchTap={this.handleOpen.bind(this)} >
          <ContentAdd />
        </FloatingActionButton>

        {/* Form */}
        <Dialog
          title="Add a new Giveaway"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
          autoScrollBodyContent={true}
          >
          <TextField floatingLabelText="Title" onChange={this.handleTitle.bind(this)} value={this.state.title}/>
          <br />
          <TextField floatingLabelText="Description" multiLine={true} fullWidth={true} rows={3} onChange={this.handleDescription.bind(this)} value={this.state.description}/>
          <br />
          <DatePicker id="datepick" formatDate={this.formatDate.bind(this)} onChange={this.handleDatePicker.bind(this)} value={this.state.date} floatingLabelText="Date" mode="landscape" />
          <TimePicker pedantic={true} format="ampm" hintText="Start Time" onChange={this.handleChangeStartTimePicker12.bind(this)} value={this.state.startTime}/>
          <TimePicker pedantic={true} format="ampm" hintText="End Time" onChange={this.handleChangeEndTimePicker12.bind(this)} value={this.state.endTime}/>

        </Dialog>
      </div>
    );
  }
}
