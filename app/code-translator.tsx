'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, FacebookIcon, LinkedinIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { translateCode } from './actions/translate'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { translations, Language } from './translations'

const LANGUAGES = [
  // Programming Languages
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP',
  'Swift', 'Kotlin', 'Scala', 'Haskell', 'Perl', 'R', 'MATLAB', 'Lua', 'Dart', 'Groovy',
  'Objective-C', 'VB.NET', 'F#', 'Clojure', 'Elixir', 'Julia', 'Fortran', 'COBOL', 'Assembly',
  'Prolog', 'Lisp', 'Erlang', 'OCaml', 'Scheme', 'Ada', 'VHDL', 'Verilog', 'SQL', 'PL/SQL',
  
  // Web Technologies
  'HTML', 'CSS', 'XML', 'JSON', 'YAML', 'Markdown', 'LaTeX', 'SVG',
  'TypeScript JSX', 'JavaScript JSX', 'Vue', 'Angular', 'Svelte',
  
  // Shell and Scripting
  'Bash', 'PowerShell', 'Shell Script', 'Batch', 'AWK', 'Sed', 'Perl Script',
  
  // Database Languages
  'MySQL', 'PostgreSQL', 'MongoDB Query', 'SQLite', 'Oracle SQL', 'T-SQL', 'NoSQL',
  
  // Mobile Development
  'Swift UI', 'Kotlin Android', 'React Native', 'Flutter', 'Xamarin',
  
  // Game Development
  'Unity C#', 'Unreal C++', 'Godot GDScript', 'Love2D Lua', 'PyGame',
  
  // Systems Programming
  'CUDA', 'OpenCL', 'Assembly x86', 'Assembly ARM', 'WebAssembly', 'Embedded C',
  
  // Functional Languages
  'Racket', 'D', 'Nim', 'Crystal', 'Zig', 'Elm', 'PureScript', 'Idris', 'Agda', 'Coq',
  
  // Cloud & Infrastructure
  'Terraform', 'CloudFormation', 'Kubernetes YAML', 'Docker Compose', 'Ansible',
  
  // Smart Contracts
  'Solidity', 'Move', 'Clarity', 'Vyper', 'Cairo',
  
  // Graphics & Shading
  'GLSL', 'HLSL', 'Metal Shading', 'OpenGL', 'WebGL',
  
  // Additional Languages
  'Pascal', 'Delphi', 'ABAP', 'ActionScript', 'Alice', 'APL', 'AutoHotkey', 'AutoIt',
  'Ballerina', 'Boo', 'Brainfuck', 'Ceylon', 'ChucK', 'Clean', 'CoffeeScript',
  'Common Lisp', 'Curry', 'Dylan', 'Eiffel', 'Factor', 'Forth', 'Hack',
  'Haxe', 'Icon', 'Io', 'J', 'Jython', 'LabVIEW', 'Ladder Logic', 'Lasso',
  'LiveCode', 'Logo', 'Maple', 'Mercury', 'Modula-2', 'Modula-3', 'NATURAL',
  'Nemerle', 'Oberon', 'Objective-J', 'Oz', 'PL/I', 'PostScript', 'Q',
  'Raku', 'REXX', 'Ring', 'SAS', 'Scratch', 'Seed7', 'Simula', 'Smalltalk',
  'SNOBOL', 'Squirrel', 'Standard ML', 'Stata', 'Tcl', 'Twig', 'VBScript',
  'Visual Basic', 'Wolfram Language', 'X10', 'XQuery'
].sort()

export default function CodeTranslator() {
  const [sourceCode, setSourceCode] = useState('')
  const [translatedCode, setTranslatedCode] = useState('')
  const [fromLanguage, setFromLanguage] = useState('')
  const [toLanguage, setToLanguage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uiLanguage, setUiLanguage] = useState<Language>('en')
  const translationCompleteSound = useRef<HTMLAudioElement | null>(null)

  const t = translations[uiLanguage]

  useEffect(() => {
    translationCompleteSound.current = new Audio('/sounds/translation-complete.mp3')
  }, [])

  async function handleTranslate() {
    if (!sourceCode || !fromLanguage || !toLanguage) {
      setError(t.fillAllFields)
      return
    }

    if (fromLanguage === toLanguage) {
      setError(t.sameLanguageError)
      return
    }

    setIsLoading(true)
    setError('')
    setTranslatedCode('')

    try {
      const result = await translateCode(sourceCode, fromLanguage, toLanguage)
      
      if (result.success && result.translatedCode) {
        setTranslatedCode(result.translatedCode)
        if (translationCompleteSound.current) {
          translationCompleteSound.current.play().catch(error => {
            console.error('Error playing translation complete sound:', error)
          })
        }
      } else {
        setError(result.error || t.unknownError)
        console.error('Translation failed:', result.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.unknownError
      console.error('Translation error:', err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background/90 dark:bg-background/80 text-foreground shadow-lg backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={fromLanguage} onValueChange={setFromLanguage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t.sourceLang} />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={toLanguage} onValueChange={setToLanguage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t.targetLang} />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.sourceCode}</label>
            <Textarea
              placeholder={t.sourceCode}
              className="min-h-[300px] font-mono"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.translatedCode}</label>
            <Textarea
              placeholder={t.translatedCode}
              className="min-h-[300px] font-mono"
              value={translatedCode}
              readOnly
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <p className="text-xs text-center text-muted-foreground">
          {t.warningMessage}
        </p>

        <Button 
          onClick={handleTranslate} 
          disabled={isLoading || !sourceCode || !fromLanguage || !toLanguage}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.translating}
            </>
          ) : (
            t.translateButton
          )}
        </Button>

        <div className="border-t border-border mt-6 pt-6 text-center text-sm text-muted-foreground">
          <p>{t.copyright}</p>
          <p className="mt-2">
            {t.developerCredit}{' '}
            <a 
              href="https://omar-abbas.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Omar Radwan
            </a>
          </p>
          <div className="flex justify-center space-x-6 mt-6">
            <a href="https://www.facebook.com/profile.php?id=61558950771638" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-focus transition-colors duration-200">
              <FacebookIcon size={24} className="hover:scale-110 transform transition-transform duration-200" />
            </a>
            <a href="https://www.linkedin.com/company/nctu-petroleum-tech/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-focus transition-colors duration-200">
              <LinkedinIcon size={24} className="hover:scale-110 transform transition-transform duration-200" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

