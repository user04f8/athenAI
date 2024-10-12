"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, User, ChevronRight, Bot } from 'lucide-react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

// Define the type for questions with response
type QuestionWithResponse = {
  question: string
  response: string
}

const baseQuestions: string[] = [
  "What's your name?",
  "What's your intended major?",
  "What's your biggest academic achievement?",
  "What's a challenge you've overcome?"
]

export default function Orientation() {
  const [questions, setQuestions] = useState<string[]>(baseQuestions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [displayedQuestion, setDisplayedQuestion] = useState('')
  const [continueAsking, setContinueAsking] = useState(true)
  const [isFetching, setIsFetching] = useState(false) // To prevent multiple fetches
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
  }, [currentQuestionIndex, questions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() === '') return

    setAnswers([...answers, inputValue])
    setInputValue('')

    const nextIndex = currentQuestionIndex + 1

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
    } else if (continueAsking && !isFetching) {
      // Fetch the next question from the API
      await fetchNextQuestion()
    }
  }

  const fetchNextQuestion = async () => {
    setIsFetching(true)
    try {
      // Construct the list_of_questions payload
      const list_of_questions: QuestionWithResponse[] = answers.map((answer, index) => ({
        question: questions[index],
        response: answer
      }))
// http://127.0.0.1:5000 is temporary and should be removed once better hosting is figured out
      const response = await fetch('http://127.0.0.1:5000/generate_question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ list_of_questions })
      })

      if (!response.ok) {
        console.error('Failed to fetch next question')
        setIsFetching(false)
        return
      }

      const data = await response.json()

      if (data.continue && data.question) {
        setQuestions(prev => [...prev, data.question])
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        setContinueAsking(false)
      }
    } catch (error) {
      console.error('Error fetching next question:', error)
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex flex-col font-sans">
      <Navbar />

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

          {!continueAsking && currentQuestionIndex >= questions.length && (
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
                  setQuestions(baseQuestions)
                  setContinueAsking(true)
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Start Over
              </button>
            </motion.div>
          )}

          {isFetching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4"
            >
              <p className="text-gray-700">Loading next question...</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
