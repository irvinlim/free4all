import React from 'react';
import FontIcon from 'material-ui/FontIcon';

export const makeIcon = (cat) => {
  if (cat.iconClass.substr(0,3) == "fa ")
    return <i className={ cat.iconClass }></i>;
  else
    return materialIcon(cat.iconClass);
};

export const materialIcon = (name) => <FontIcon className="material-icons">{ name }</FontIcon>
