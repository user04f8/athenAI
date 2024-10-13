import React from 'react';
import EssayEditor from './EssayEditor';
import FeedbackDisplay from './FeedbackDisplay';

const ParentComponent = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-2/3 p-4">
        <EssayEditor />
      </div>
      <div className="w-full md:w-1/3 p-4">
        <FeedbackDisplay />
      </div>
    </div>
  );
};

export default ParentComponent;
