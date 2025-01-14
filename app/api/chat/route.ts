import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: NextRequest) {
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'API key is not configured. Please check your environment variables.' }, 
      { status: 500 }
    )
  }

  try {
    const { message, language, maxLength, creator, role, facebook, linkedin } = await req.json()

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `You are a helpful AI assistant for a code translation website. 
    This website and chat support were created by ${creator}, who is the ${role}.
    If asked about the team, provide these social media links:
    Facebook: ${facebook}
    LinkedIn: ${linkedin}
    
    The user's message is: "${message}". 
    
    Please provide a concise and helpful response in ${language}, focusing on code correctness. 
    Keep your response under ${maxLength} words.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const aiResponse = response.text()

    if (!aiResponse) {
      throw new Error('No response generated from AI')
    }

    return NextResponse.json({ response: aiResponse }, { status: 200 })
  } catch (error) {
    console.error('Error in Gemini AI chat:', error)
    let errorMessage = 'Failed to get AI response'
    if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

