import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';
import { authService } from './services/authService';
import  authAxios  from './services/authAxios';

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
        <h2>Authentication Error</h2>
        <p>{err.message}</p>
      </div>
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

// Export auth service functions
export const getCurrentUser = authService.getCurrentUser;
export const login = authService.login;
export const logout = authService.logout;
export const isAuthenticated = authService.isAuthenticated;

// Export the axios instance with auth interceptors
export {authAxios};
