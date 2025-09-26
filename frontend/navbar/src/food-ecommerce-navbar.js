import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Root from './root.component';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  domElementGetter: (props) => {
    return props.domElement || document.getElementById('navbar');
  },
  errorBoundary(err, info, props) {
    return (
      <div className="error-boundary">
        <h2>Error in Navbar</h2>
        <p>{err.message}</p>
      </div>
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
