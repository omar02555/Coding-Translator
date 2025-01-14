'use client'

import { useState } from 'react'
import Image from 'next/image'
import CodeTranslator from './code-translator'
import { translations, Language } from './translations'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import ChatbotSupport from './components/ChatbotSupport'
import { ThemeSwitcher } from './components/ThemeSwitcher'

export default function Home() {
  const [uiLanguage, setUiLanguage] = useState<Language>('en')
  const t = translations[uiLanguage]

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/00PUYW8XLJnSTbjdIkBjxuFJp8-qTTySUj2lLZOcZ5TYO59qVcEjCVH0v.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full p-4 flex justify-between items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20(9)-BebOys4J39GQQdgxOTo6zquGSK5Vb6.png"
            alt="NCTU Petroleum Tech Logo"
            width={180}
            height={60}
            className="block dark:hidden"
            priority
          />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nctu-petroleum-tech-HfKPJPKZABIk1VjdmaEhyVwFQqlMBh.png"
            alt="NCTU Petroleum Tech Logo Dark"
            width={180}
            height={60}
            className="hidden dark:block"
            priority
          />
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setUiLanguage(uiLanguage === 'en' ? 'ar' : 'en')}
              title={uiLanguage === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              <Globe className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue%20and%20Black%20Neon%20Holographic%20Mobile%20Video%20Background%20(2)-QY6ND3qPOYgGKcWsQakcJdWpsRJFJC.gif"
              alt="Animated Logo"
              width={200}
              height={200}
              className="h-auto w-[300x]"
              priority
            />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-center mb-4 text-white drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            {t.title}
          </h1>
          <p className="max-w-2xl text-xl text-center mb-8 text-white font-semibold drop-shadow-[0_0_10px_rgba(0,0,0,0.7)]">
            {uiLanguage === 'en' ? (
              <>
                Empowering Egyptian developers with <span className="text-cyan-300">cutting-edge AI models</span>.
                A bold initiative by <span className="text-cyan-300">NCTU Petroleum Tech</span> to accelerate Egypt's technological growth.
              </>
            ) : (
              <>
                تمكين المطورين المصريين من خلال <span className="text-cyan-300">نماذج الذكاء الاصطناعي المتطورة</span>.
                مبادرة جريئة من فريق <span className="text-cyan-300">NCTU Petroleum Tech</span> لتسريع النمو التكنولوجي في مصر.
              </>
            )}
          </p>
          <CodeTranslator />
        </div>
        <ChatbotSupport language={uiLanguage} />
      </div>
    </main>
  )
}

