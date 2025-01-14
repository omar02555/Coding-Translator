'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

interface TranslationResult {
  success: boolean;
  translatedCode?: string;
  error?: string;
}

export async function translateCode(
  sourceCode: string,
  fromLanguage: string,
  toLanguage: string
): Promise<TranslationResult> {
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
  
  if (!process.env.GEMINI_API_KEY) {
    return {
      success: false,
      error: 'API key is not configured'
    }
  }

  if (!sourceCode || !fromLanguage || !toLanguage) {
    return { 
      success: false, 
      error: 'Missing required parameters' 
    }
  }

  try {
    console.log(`Attempting to translate from ${fromLanguage} to ${toLanguage}`)
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a code translation expert. Translate the following ${fromLanguage} code to ${toLanguage}. Only respond with the translated code, no explanations or markdown:

${sourceCode}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedCode = response.text();

    if (!translatedCode) {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid response from Gemini Pro');
    }

    console.log('Translation successful');

    return { 
      success: true, 
      translatedCode: translatedCode.trim()
    };

  } catch (error) {
    console.error('Full error object:', error);
    
    let errorMessage = 'An unexpected error occurred during translation';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }

    return { 
      success: false, 
      error: errorMessage
    };
  }
}

