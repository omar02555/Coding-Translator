'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Language, translations } from '../translations'

const initialCode = `# Welcome to Python!
# Let's start with a simple "Hello, World!" program

print("Hello, World!")

# Now, let's try a variable
name = "NPA Coder"
print(f"Hello, {name}!")

# Can you modify the code to use your own name?
`

interface PythonTutorialProps {
  language: Language
}

const PythonTutorial: React.FC<PythonTutorialProps> = ({ language }) => {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const t = translations[language]

  const runCode = async () => {
    setError('')
    setOutput('')
    try {
      const response = await fetch('/api/run-python', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const result = await response.json()
      if (result.error) {
        setError(result.error)
      } else {
        setOutput(result.output)
      }
    } catch (err) {
      setError(t.executionError)
    }
  }

  return null
}

export default PythonTutorial

