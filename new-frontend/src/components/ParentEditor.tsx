// ParentComponent.jsx

import React from 'react';
import Navbar from './Navbar';
import EssayEditor from './EssayEditor';
import FeedbackDisplay from './FeedbackDisplay';

const ParentComponent = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row flex-grow">
        <div className="w-full md:w-2/3 p-4">
          <EssayEditor />
        </div>
        <div className="w-full md:w-1/3 p-4">
          <FeedbackDisplay />
        </div>
      </div>
    </div>
  );
};

export default ParentComponent;
