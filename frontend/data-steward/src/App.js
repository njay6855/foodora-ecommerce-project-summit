import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataStewardDashboard from './components/DataStewardDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/data-steward" element={<DataStewardDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
