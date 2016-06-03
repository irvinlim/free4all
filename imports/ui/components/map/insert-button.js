import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';


/**
* Dialog content can be scrollable.
*/
export default class InsertBtnDialog extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      open: false,       
    };
    this.style = {
      marginRight: 20,
      position: "fixed",
      bottom: "5%",
      left: "95%"
    }
  }
  handleOpen() {
    this.setState({open: true});
  };
  
  handleClose() {
    this.setState({open: false});
  };
  
  
  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose.bind(this)}
        autoScrollBodyContent={true}
        onRequestClose={this.handleClose.bind(this)}
        />,
    ];
    
    return (
      <div>

        <FloatingActionButton style={this.style} onTouchTap={this.handleOpen.bind(this)} >
          <ContentAdd />
        </FloatingActionButton>

        <Dialog
          title="Dialog With Date Picker"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
          >
          Open a Date Picker dialog from within a dialog.
          <DatePicker hintText="Date Picker" />
        </Dialog>
      </div>
    );
  }
}