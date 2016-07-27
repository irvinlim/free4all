import React from 'react';
import Paper from 'material-ui/Paper';

const PaperCard = ({ children, className }) => (
  <div className="flex-row">
    <div className="col col-xs-12 nopad">
      <Paper className={"card " + (className ? className : "") }>
        { children }
      </Paper>
    </div>
  </div>
);

PaperCard.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default PaperCard;
