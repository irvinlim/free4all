import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

export const Loading = (props) => {
  let { containerClassName, containerStyle } = props;

  if (!containerClassName)
    containerClassName = "loading-container";

  return (
    <div className={ containerClassName } style={ containerStyle }>
      <CircularProgress />
    </div>
  );
};

export const LoadingWithProps = (props) => {
  let { containerClassName } = props;

  if (!containerClassName)
    containerClassName = "loading-container";

  return () => (
    <div className={ containerClassName }>
      <CircularProgress />
    </div>
  );
};
