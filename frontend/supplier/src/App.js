import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SupplierDashboard from './components/SupplierDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/supplier" element={<SupplierDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
