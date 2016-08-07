import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import * as IconsHelper from '../../../util/icons';

const InsertBtn = props => (

  <FloatingActionButton className="floatingButton" onTouchTap={props.handleOpen}>
    { IconsHelper.materialIcon("add") }
  </FloatingActionButton>

)

export default InsertBtn;
