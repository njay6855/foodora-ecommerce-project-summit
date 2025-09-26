import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function Root(props) {
  return (
    <Router>
      <Navbar />
    </Router>
  );
}
