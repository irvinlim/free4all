import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import { Giveaway } from './giveaway.js';

export const GiveawaysList = ({ giveaways }) => (
  giveaways.length > 0 ? <ListGroup className="documents-list">
    {giveaways.map((doc) => (
      <Giveaway key={ doc._id } giveaway={ doc } />
    ))}
  </ListGroup> :
  <Alert bsStyle="warning">No documents yet.</Alert>
);

GiveawaysList.propTypes = {
  giveaways: React.PropTypes.array,
};
