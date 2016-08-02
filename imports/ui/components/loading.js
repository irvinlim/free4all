import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

export const Loading = (props) => {
  let { containerClassName, containerStyle, ...rest } = props;

  if (!containerClassName)
    containerClassName = "loading-container";

  return (
    <div className={ containerClassName } style={ containerStyle }>
      <CircularProgress {...rest} />
    </div>
  );
};

export const LoadingWithProps = (props) => {
  let { containerClassName, ...rest } = props;

  if (!containerClassName)
    containerClassName = "loading-container";

  return () => (
    <div className={ containerClassName }>
      <CircularProgress {...rest} />
    </div>
  );
};
