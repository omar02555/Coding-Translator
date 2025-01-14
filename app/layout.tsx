import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "./components/theme-provider"
import WebsiteOpenSound from './components/WebsiteOpenSound'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NPA Coding Translator',
  description: 'Translate code between different programming languages using AI',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WebsiteOpenSound />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

