import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Root from './root.component';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  domElementGetter: (props) => {
    // Use the provided domElement from customProps, or fallback to #footer
    return props.domElement || document.getElementById('footer');
  },
  errorBoundary(err, info, props) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Footer Error</h2>
        <p>There was an error loading the footer component.</p>
      </div>
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;