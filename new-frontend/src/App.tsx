// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Onboarding from './components/Onboarding'
import EssayEditor from './components/EssayEditor'; // Import the new EssayEditor component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} /> {/* Home route for Orientation */}
        <Route path="/essay-editor" element={<EssayEditor />} /> {/* Route for Essay Editor */}
      </Routes>
    </Router>
  );
}

export default App;
