import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const RemoveGiveawayDialog = ({ open, handleClose, handleSubmit }) => {
  const actions = [
    <FlatButton label="Cancel" onTouchTap={ handleClose } />,
    <FlatButton label="Submit" onTouchTap={ handleSubmit } />,
  ];

  return (
    <Dialog
      title="Are you sure?"
      open={ open }
      actions={ actions }
      onRequestClose={ handleClose }>
      <p>Are you sure you would like to delete this giveaway?</p>
    </Dialog>
  );
};

export default RemoveGiveawayDialog;