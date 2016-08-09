import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const ConfirmDialog = ({ open, handleClose, handleSubmit, title, children, ...rest }) => {
  const actions = [
    <FlatButton label="Cancel" onTouchTap={ handleClose } />,
    <FlatButton label="Submit" onTouchTap={ handleSubmit } />,
  ];

  return (
    <Dialog
      title={ title }
      actions={ actions }
      open={ open }
      onRequestClose={ handleClose }
      {...rest}>

      { children }

    </Dialog>
  );
};

export default ConfirmDialog;
