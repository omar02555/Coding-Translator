'use client'

import { useEffect, useRef } from 'react'

export default function WebsiteOpenSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !hasPlayedRef.current) {
      audioRef.current = new Audio('/sounds/website-open.mp3')
    
      audioRef.current.addEventListener('canplaythrough', () => {
        const playSound = () => {
          if (audioRef.current && !hasPlayedRef.current) {
            audioRef.current.play().catch(error => {
              console.error('Error playing audio:', error)
            })
            hasPlayedRef.current = true
          }
          document.removeEventListener('click', playSound)
        }

        document.addEventListener('click', playSound)
      })

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplaythrough', () => {})
        }
        document.removeEventListener('click', () => {})
      }
    }
  }, [])

  return null
}

