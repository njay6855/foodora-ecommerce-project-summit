import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './components/Footer';

export default function Root(props) {
  return (
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
}