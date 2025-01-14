export interface TranslationResult {
  success: boolean
  translatedCode?: string
  error?: string
}

export interface OpenAIError extends Error {
  status?: number
  code?: string
  type?: string
}

