import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

export const Loading = () => (
  <div className="loading-container">
    <CircularProgress />
  </div>
);

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
