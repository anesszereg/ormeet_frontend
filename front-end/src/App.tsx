import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MyTicketsPage from './pages/MyTicketsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/" element={<Navigate to="/my-tickets" replace />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
