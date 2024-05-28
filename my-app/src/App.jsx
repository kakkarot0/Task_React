

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Fetch from './components/Fetch.jsx';
import PostDetail from './components/PostDetail.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Fetch />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </Router>
  );
};

export default App;

