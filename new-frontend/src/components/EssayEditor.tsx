'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import Navbar from './Navbar'
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

// these are taken directly from common app
const prompts = [
  "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
  "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
  "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
  "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
  "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
  "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
  "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design."
]

export default function EssayEditor() {
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [essay, setEssay] = useState('')

  const handleGenerateFeedback = () => {
    // Implement feedback generation logic here
    console.log('Generating feedback for:', { selectedPrompt, essay })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center p-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">Essay Editor</h2>
          
          <div className="space-y-6 mb-8">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">Select Prompt</label>
              <Select onValueChange={setSelectedPrompt}>
                <SelectTrigger className="w-full min-h-[50px]">
                  <SelectValue placeholder="Choose a prompt" />
                </SelectTrigger>
                <SelectContent className="max-h-[400px] overflow-y-auto">
                  {prompts.map((prompt, index) => (
                    <SelectItem key={index} value={prompt} className="whitespace-normal py-2 border-b last:border-b-0">
                      <div className="break-words">{prompt}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="essay" className="block text-sm font-medium text-gray-700 mb-2">Your Essay</label>
              <Textarea
                id="essay"
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[400px] resize-y bg-purple-50 text-gray-900 placeholder-gray-400 transition duration-300 ease-in-out"
                placeholder="Start typing your essay here..."
              />
            </div>

            <Button
              onClick={handleGenerateFeedback}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            >
              <FileText className="mr-2 h-5 w-5" />
              <span>Generate Feedback</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}