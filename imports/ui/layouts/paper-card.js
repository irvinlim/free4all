import React from 'react';
import Paper from 'material-ui/Paper';

const PaperCard = ({ children, className, ...rest }) => (
  <div className="flex-row">
    <div className="col col-xs-12 nopad">
      <Paper className={"card " + (className ? className : "") } {...rest}>
        { children }
      </Paper>
    </div>
  </div>
);

PaperCard.propTypes = {
  children: React.PropTypes.node.isRequired,
};

export default PaperCard;
