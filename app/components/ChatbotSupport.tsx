'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, Send, X, Maximize, Minimize, Trash2 } from 'lucide-react'
import { Language, translations } from '../translations'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatbotSupportProps {
  language: Language
}

export default function ChatbotSupport({ language }: ChatbotSupportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showClearHistory, setShowClearHistory] = useState(false)
  const t = translations[language]

  useEffect(() => {
    setShowNotification(true)
    const timer = setTimeout(() => {
      setShowNotification(false)
    }, 5000)

    setShowClearHistory(messages.length > 0)

    return () => clearTimeout(timer)
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const creator = "Omar Radwan"
      const role = "Social Media Head in NCTU Petroleum Tech Team"
      const facebook = "https://www.facebook.com/profile.php?id=61558950771638"
      const linkedin = "https://www.linkedin.com/company/nctu-petroleum-tech/posts/?feedView=all"
      const maxLength = 100

      const prompt = `You are a helpful AI assistant for a code translation website. 
This website and chat support were created by ${creator}, who is the ${role}.
If asked about the team, provide these social media links:
Facebook: ${facebook}
LinkedIn: ${linkedin}

The user's message is: "${input}". 

Please provide a concise and helpful response in ${language}, focusing on code correctness. 
Use headings (preceded by ##) for main points and bullet points (preceded by -) for lists.
Keep your response under ${maxLength} words.`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: prompt, 
          language, 
          maxLength,
          creator,
          role,
          facebook,
          linkedin
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (!data.response) {
        throw new Error('No response data received')
      }

      const assistantMessage: Message = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error in chat:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `${t.chatErrorDetailed} ${errorMessage}` 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const formatResponse = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('##')) {
        return <h3 key={index} className="font-bold mt-2 mb-1">{line.replace('##', '').trim()}</h3>;
      } else if (line.startsWith('-')) {
        return <li key={index} className="ml-4">{line.replace('-', '').trim()}</li>;
      } else {
        return <p key={index}>{line}</p>;
      }
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const clearHistory = () => {
    setMessages([])
    setShowClearHistory(false)
  }

  return (
    <>
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-4 bg-primary text-primary-foreground p-2 rounded-lg shadow-lg z-50"
          >
            {t.chatNotification}
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        className="fixed bottom-4 right-4 rounded-full p-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={24} />
      </Button>

      {isOpen && (
        <Card className={`fixed ${isFullscreen ? 'inset-0' : 'bottom-20 right-4 w-80 h-[400px]'} flex flex-col transition-all duration-300 ease-in-out z-50`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t.chatSupport}</CardTitle>
            <div className="flex-shrink-0 w-12 h-12 mx-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue%20and%20Black%20Neon%20Holographic%20Mobile%20Video%20Background%20(2)-ezI5dBnNhTb7lHkH8cECuS8wdkpesF.gif"
                alt="Holographic Animation"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="flex items-center space-x-2">
              {showClearHistory && (
                <Button variant="ghost" size="sm" onClick={clearHistory} className="mr-2">
                  <Trash2 size={16} className="mr-1" />
                  {t.clearHistory}
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col overflow-hidden">
            <ScrollArea className="flex-grow pr-4 mb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground self-end'
                      : 'bg-secondary text-secondary-foreground self-start'
                  } max-w-[80%] break-words`}
                >
                  {msg.role === 'assistant' ? formatResponse(msg.content) : msg.content}
                </div>
              ))}
            </ScrollArea>
            <div className="mt-auto flex">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder={t.typeMessage}
                className="flex-grow mr-2"
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading}>
                <Send size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

