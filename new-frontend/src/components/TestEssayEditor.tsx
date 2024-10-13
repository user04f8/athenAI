import React, { useState, useEffect, useRef } from 'react'

export default function TestEssayEditor() {
  const [responseText, setResponseText] = useState('')
  const [overallFeedbackResponseText, setOverallFeedbackResponseText] = useState('')
  const hasFetched = useRef(false)

  useEffect(() => {
    // Avoid duplicate fetch in Strict Mode
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchData = async () => {
      const essay_prompt = "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story."
      const essay = "Sports aren\u2019t a staircase that can be easily climbed. When you first stand at the bottom and look at those that are already at the top, the destination becomes enticing. Each sport is a different staircase, and once you pick which staircase you want to take, the real journey begins. The first few steps are easy: joining a team, making friends, and just having fun. As you begin to climb, it seems so simple and you ask yourself, \u201cWhy wouldn\u2019t everyone want to climb this staircase?\u201d But soon but your ignorance will fade and you will realize why some choose to stay on the ground level. \nThe longer and higher you climb, the more serious you get about making it to the top. The pressure of reaching the final destination can feel overwhelming at times, but you keep climbing because after starting this journey, you become determined to finish it. For some, this is not the case. They look down at the bottom of the staircase and decide that giving up on all of the steps that they have spent so much time climbing is a better option than continuing to climb a staircase that they don\u2019t even want to be on anymore. For those who keep climbing, they trip and they fall, maybe sometimes even going down a few steps. When they take a break, it feels as if they are going to fall behind, and that everyone else is going to beat them to the top. \nAlthough the staircase is being portrayed to seem like a constant struggle, those who truly want to be on it fall in love with the process of climbing. There is no better feeling than looking down and seeing how far you have come compared to where you started. Reaching certain floors on the way to the top is one of the best and most validating feelings there is, especially when you are reaching those floors with people who you would do anything for. In a way, the staircase is never-ending. Once you make it to the top, you can always go back down and help those who have just started the climb. If there is one thing that the staircase of sports will teach you, it\u2019s that no matter how hard the climbing felt, every step was completely worth it."
    
      const getAPIEndpoint = async (endpoint: string, setHook: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/${endpoint}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ essay, essay_prompt })
            })
    
            if (!response.ok) {
              console.error('Response not ok:', response.statusText)
              return
            }
    
            const reader = response.body?.getReader()!
            const decoder = new TextDecoder('utf-8')
    
            let result = ''
            let done = false
    
            while (!done) {
              const { value, done: doneReading } = await reader.read()
              done = doneReading
              if (value) {
                const chunk = decoder.decode(value)
                result += chunk
                setHook((prev) => prev + chunk)
              }
            }
          } catch (error) {
            console.error('Error fetching data:', error)
          }
      }
    //   getAPIEndpoint('essay_feedback', setResponseText)

      getAPIEndpoint('essay_overall_feedback', setOverallFeedbackResponseText)
      
    }

    fetchData()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Test Essay Editor</h1>
      <p className="mb-2">Specific feedback:</p>
      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{responseText}</pre>
      <p className="mb-2">Overall feedback:</p>
      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{overallFeedbackResponseText}</pre>
    </div>
  )
}
