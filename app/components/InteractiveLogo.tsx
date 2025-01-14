'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const InteractiveLogo: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isBlinking, setIsBlinking] = useState(false)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 200)
    }, 3000)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(blinkInterval)
    }
  }, [])

  const eyeStyle = (leftEye: boolean) => {
    const baseX = leftEye ? 100 : 200
    const baseY = 150
    const angle = Math.atan2(mousePosition.y - baseY, mousePosition.x - baseX)
    const distance = Math.min(10, Math.sqrt(Math.pow(mousePosition.x - baseX, 2) + Math.pow(mousePosition.y - baseY, 2)) / 5)
    const eyeX = baseX + Math.cos(angle) * distance
    const eyeY = baseY + Math.sin(angle) * distance

    return {
      cx: eyeX,
      cy: eyeY,
      r: isBlinking ? 0 : 20,
    }
  }

  return (
    <div ref={logoRef} className="relative w-[300px] h-[300px] mx-auto">
      <Image
        src="/Untitled design.svg"
        alt="NPA Coding Translator Logo"
        width={300}
        height={300}
        className="dark:invert"
        priority
      />
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 300 300">
        <circle cx="100" cy="150" r="40" fill="white" />
        <circle cx="200" cy="150" r="40" fill="white" />
        <circle {...eyeStyle(true)} fill="black" />
        <circle {...eyeStyle(false)} fill="black" />
      </svg>
    </div>
  )
}

export default InteractiveLogo

