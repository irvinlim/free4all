import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import * as IconsHelper from '../../../util/icons';

const ConfirmRGeo = props => {

  const { locArr } = props;

  let locName    = ""
    , locAddress = "";

  if(locArr.length > 0){
    const locationText = locArr[0].text;
    const strSplitIdx = locationText.indexOf(',');
    locName = locationText.substr(0, strSplitIdx);
    locAddress = locationText.substr(strSplitIdx + 1);

    return (
      <div id="confirm-rgeo-box" className="map-sidebar-box">

        <h3>{ locName  }</h3>
        <h5>{ locAddress }</h5>

        <FloatingActionButton
          backgroundColor="#8bc34a"
          className="confirm-rgeo-btn"
          onTouchTap={ props.openInsertDialog }>
        { IconsHelper.icon("check") }
        </FloatingActionButton>
      </div>
    )
  }
  return ( <div /> )

}

export default ConfirmRGeo;
