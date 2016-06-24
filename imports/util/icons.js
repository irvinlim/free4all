import React from 'react';
import FontIcon from 'material-ui/FontIcon';

export const catIcon = (cat) => icon(cat.iconClass);

export const icon = (className, color="") => {
  if (className.substr(0,3) == "fa ")
    return <i className={ className } style={{ color: color }}></i>;
  else
    return materialIcon(className, color);
};

export const materialIcon = (name, color="") => (
  <FontIcon
    className="material-icons"
    color={ color }>
    { name }
  </FontIcon>
);
