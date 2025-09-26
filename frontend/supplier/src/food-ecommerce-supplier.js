import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  domElementGetter: (props) => {
    return props.domElement || document.getElementById('root');
  },
  errorBoundary(err, info, props) {
    return (
      <div className="error-boundary">
        <h2>Error</h2>
        <p>{err.message}</p>
      </div>
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
