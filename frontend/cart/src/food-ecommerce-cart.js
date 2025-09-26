import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';

// Initialize cart events
const setupCartEvents = async () => {
  try {
    const { getCurrentUser } = await System.import('@food-ecommerce/auth');
    const { initializeCartEvents } = await import('./events/cartEvents');
    return initializeCartEvents(getCurrentUser);
  } catch (error) {
    console.error('Failed to initialize cart events:', error);
  }
};

// Initialize events when the module loads
setupCartEvents();

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

// Export function to get cart state
export const getCartState = () => {
  try {
    const { getStore } = require('./store');
    const store = getStore();
    return store.getState().cart;
  } catch (error) {
    console.error('Error getting cart state:', error);
    return { items: [] };
  }
};
