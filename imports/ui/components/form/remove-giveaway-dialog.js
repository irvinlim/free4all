import React from 'react';
import ConfirmDialog from '../../layouts/confirm-dialog';

const RemoveGiveawayDialog = (props) => (
  <ConfirmDialog title="Are you sure?" {...props}>
    Are you sure you would like to remove this giveaway?
  </ConfirmDialog>
);

export default RemoveGiveawayDialog;
