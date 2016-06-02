import React from 'react';
import { Row, Col, ListGroupItem, FormControl, Button } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { updateGiveaway, removeGiveaway } from '../../api/giveaways/methods.js';

const handleUpdateGiveaway = (giveawayId, event) => {
  const title = event.target.value.trim();
  if (title !== '' && event.keyCode === 13) {
    updateGiveaway.call({
      _id: giveawayId,
      update: { title },
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Giveaway updated!', 'success');
      }
    });
  }
};

const handleRemoveGiveaway = (giveawayId, event) => {
  event.preventDefault();
  // this should be replaced with a styled solution so for now we will
  // disable the eslint `no-alert`
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure? This is permanent.')) {
    removeGiveaway.call({
      _id: giveawayId,
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Giveaway removed!', 'success');
      }
    });
  }
};

export const Giveaway = ({ giveaway }) => (
  <ListGroupItem key={ giveaway._id }>
    <Row>
      <Col xs={ 8 } sm={ 10 }>
        <FormControl
          type="text"
          standalone
          defaultValue={ giveaway.title }
          onKeyUp={ handleUpdateGiveaway.bind(this, giveaway._id) }
        />
      </Col>
      <Col xs={ 4 } sm={ 2 }>
        <Button
          bsStyle="danger"
          className="btn-block"
          onClick={ handleRemoveGiveaway.bind(this, giveaway._id) }>
          Remove
        </Button>
      </Col>
    </Row>
  </ListGroupItem>
);
