'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FeedbackItem } from './types';

const prompts = [
  "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
  "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
  "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
  "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
  "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
  "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
  "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design."
];

interface EssayEditorProps {
  setFeedbackList: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
}

  // Add minimum and maximum character length
  const MIN_CHARACTERS = 125;
  const MAX_CHARACTERS = 7000;

export default function EssayEditor({ setFeedbackList }: EssayEditorProps) {
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [essay, setEssay] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [highlightKeys, setHighlightKeys] = useState<string[]>([]);

  const handleGenerateFeedback = async () => {
    console.log('Generating feedback for:', { selectedPrompt, essay });
    setIsEditing(false);

    // Reset feedback and highlights
    setFeedbackList([]);
    setHighlightKeys([]);

    try {
      // NOTE: Comment in below line and comment out line below that for prod branch
      // const response = await fetch('/essay_feedback', {
      const response = await fetch('http://127.0.0.1:5000/essay_feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ essay, essay_prompt: selectedPrompt }),
      });
      
      if (!response.ok) {
        console.error('Response not ok:', response.statusText);
        return;
      }
      
      // Check if response.body is null or undefined
      if (!response.body) {
        console.error('Response body is null, cannot read the stream.');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let done = false;
      let hasFeedback = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          buffer += chunk;

          // Process complete groups in the buffer
          let groupStart = buffer.indexOf('<');
          let groupEnd = buffer.indexOf('>');

          while (groupStart !== -1 && groupEnd !== -1 && groupEnd > groupStart) {
            const group = buffer.substring(groupStart + 1, groupEnd);
            buffer = buffer.substring(groupEnd + 1);

            // Parse the group
            const parts = group.split('|');
            if (parts.length >= 2) {
              const key = parts[0].trim();
              const valuePart = parts.slice(1).join('|').trim();

              // Update feedback list
              hasFeedback = true
              setFeedbackList((prevList) => [
                ...prevList,
                { id: prevList.length + 1, text: valuePart },
              ]);

              // Add key to highlightKeys
              setHighlightKeys((prevKeys) => [...prevKeys, key]);
            }

            groupStart = buffer.indexOf('<');
            groupEnd = buffer.indexOf('>');
          }
        }
      }
      
      // Fallback: If no valid feedback items were found, add the entire response as a single item
      if (!hasFeedback) {
        setFeedbackList([
          { id: 1, text: buffer.trim() || 'Feedback unavailable.' },
        ]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEditEssay = () => {
    setIsEditing(true);
    setHighlightKeys([]);
  };

  function renderEssayWithHighlights() {
    let highlightedText = essay;

    // Sort keys by length to prevent nested highlights
    const sortedKeys = [...highlightKeys]
    // .sort((a, b) => b.length - a.length);

    sortedKeys.forEach((key, index) => {
      const escapedKey = key.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'); // Escape regex special characters
      const regex = new RegExp(escapedKey, 'g');

      // Alternate between two shades of purple
      const colorClass = index % 2 === 0 ? 'bg-purple-100' : 'bg-blue-100';

      highlightedText = highlightedText.replace(
        regex,
        `<mark class="${colorClass}">${key}</mark><sup>${index + 1}</sup>`
      );
      
    });
    return highlightedText;
  }

  // Calculate essay length and determine if it's valid
  const essayLength = essay.length;
  const isEssayValid = essayLength >= MIN_CHARACTERS && essayLength <= MAX_CHARACTERS;


  return (
    <div className="flex-grow flex flex-col items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2/3 bg-white rounded-lg shadow-2xl p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">
          Essay Editor
        </h2>

        <div className="space-y-6 mb-8">
          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Prompt
            </label>
            <Select onValueChange={setSelectedPrompt}>
              <SelectTrigger className="w-full min-h-[50px]">
                <SelectValue placeholder="Choose a prompt" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px] overflow-y-auto">
                {prompts.map((prompt, index) => (
                  <SelectItem
                    key={index}
                    value={prompt}
                    className="whitespace-normal py-2 border-b last:border-b-0"
                  >
                    <div className="break-words">{prompt}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="essay"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Essay
            </label>
            {isEditing ? (
              <Textarea
                id="essay"
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-[445px] resize-y bg-purple-50 text-gray-900 placeholder-gray-400 transition duration-300 ease-in-out"
                placeholder="Start typing your essay here..."
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: renderEssayWithHighlights() }}
                className="prose max-w-full text-gray-900 bg-purple-50 p-4 rounded-md h-[445px] overflow-y-auto"
              />
            )}
          </div>

          <div className="text-sm text-gray-600">
            {essayLength < MIN_CHARACTERS && (
              <p>Essay must be at least {MIN_CHARACTERS} characters. You need {MIN_CHARACTERS - essayLength} more.</p>
            )}
            {essayLength > MAX_CHARACTERS && (
              <p>Essay must be less than {MAX_CHARACTERS} characters. You need to remove {essayLength - MAX_CHARACTERS} characters.</p>
            )}
          </div>

          {isEditing ? (
            <Button
              onClick={handleGenerateFeedback}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              disabled={!isEssayValid} // Disable button if essay length is invalid
            >
              <FileText className="mr-2 h-5 w-5" />
              <span>Generate Feedback</span>
            </Button>
          ) : (
            <Button
              onClick={handleEditEssay}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            >
              <Edit3 className="mr-2 h-5 w-5" />
              <span>Edit Essay</span>
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}