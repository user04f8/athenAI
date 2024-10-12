"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, User, ChevronRight, Bot } from 'lucide-react'

const questions = [
  "What's your name?",
  "What's your intended major?",
  "What's your biggest academic achievement?",
  "What's a challenge you've overcome?"
]

export default function Orientation() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [displayedQuestion, setDisplayedQuestion] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentQuestionIndex])

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= questions[currentQuestionIndex].length) {
        setDisplayedQuestion(questions[currentQuestionIndex].slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [currentQuestionIndex])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() === '') return

    setAnswers([...answers, inputValue])
    setInputValue('')

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex flex-col font-sans">
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen className="h-8 w-8 text-purple-500" />
                <span className="ml-2 text-xl font-bold text-purple-600">Athena Prep</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#" className="border-b-2 border-purple-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Orientation
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-purple-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Essay Editor
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-purple-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  About
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <button className="bg-purple-100 p-1 rounded-full text-purple-500 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-110">
                <span className="sr-only">View profile</span>
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-center p-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-white rounded-lg shadow-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">College Essay Writing Orientation</h2>
          <p className="text-gray-600 mb-8">
            Welcome to our college essay writing orientation! This process will help us understand your background and goals.
          </p>

          <div className="space-y-6 mb-8">
            <AnimatePresence>
              {answers.map((answer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-purple-50 p-4 rounded-lg"
                >
                  <p className="font-semibold text-purple-700 mb-2">{questions[index]}</p>
                  <p className="text-gray-700">{answer}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {currentQuestionIndex < questions.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 mr-2">
                  <Bot className="text-gray-800 w-7 h-7" aria-hidden="true" />
                </div>
                <p className="font-semibold text-gray-800 text-lg">{displayedQuestion}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-y bg-purple-50 text-gray-900 placeholder-gray-400 transition duration-300 ease-in-out"
                  placeholder="Type your answer here..."
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                >
                  <span>Next</span>
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </form>
            </motion.div>
          )}

          {currentQuestionIndex === questions.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-green-600 font-semibold text-lg mb-4">Thank you for completing the orientation!</p>
              <button
                onClick={() => {
                  setCurrentQuestionIndex(0)
                  setAnswers([])
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Start Over
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}