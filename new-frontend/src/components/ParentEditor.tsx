// ParentComponent.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EssayEditor from './EssayEditor';
import FeedbackDisplay from './FeedbackDisplay';
import { FeedbackItem } from './types';

const ParentComponent = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const hasFeedback = feedbackList.length > 0;

  return (
    <div
      className={`flex flex-col h-screen p-4 overflow-hidden ${
        hasFeedback ? 'md:flex-row' : 'items-center'
      }`}
    >
      <AnimatePresence>
        {/* EssayEditor */}
        <motion.div
          key="editor"
          className="flex flex-col"
          layout
          initial={{ width: '100%' }}
          animate={{ width: hasFeedback ? '66%' : '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{ minWidth: 0 }}
        >
          <EssayEditor setFeedbackList={setFeedbackList} />
        </motion.div>

        {/* FeedbackDisplay */}
        {hasFeedback && (
          <motion.div
            key="feedback"
            className="flex flex-col justify-center"
            layout
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '34%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ minWidth: 0 }}
          >
            <FeedbackDisplay feedback={feedbackList} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParentComponent;
