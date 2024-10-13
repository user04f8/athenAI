// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Onboarding from './components/Onboarding'
import EssayEditor from './components/EssayEditor';
import TestEssayEditor from './components/TestEssayEditor'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} /> {/* Home route for Orientation */}
        <Route path="/essay-editor" element={<EssayEditor />} /> {/* Route for Essay Editor */}

        <Route path='/test-essay-editor' element={<TestEssayEditor />} /> {/* Purely for debugging */}
      </Routes>
    </Router>
  );
}

export default App;
