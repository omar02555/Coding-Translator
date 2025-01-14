'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'

export default function MorphicFace() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isBlinking, setIsBlinking] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const leftEyeRef = useRef({ x: 0, y: 0 })
  const rightEyeRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        setMousePosition({ x, y })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Blink randomly
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }, Math.random() * 4000 + 2000)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(blinkInterval)
    }
  }, [])

  useAnimationFrame((t) => {
    const moveEye = (currentPos: { x: number, y: number }, targetX: number, targetY: number) => {
      const speed = 0.1
      currentPos.x += (targetX - currentPos.x) * speed
      currentPos.y += (targetY - currentPos.y) * speed
    }

    // Calculate target positions with limits
    const targetX = (mousePosition.x - 0.5) * 20
    const targetY = (mousePosition.y - 0.5) * 20

    moveEye(leftEyeRef.current, targetX, targetY)
    moveEye(rightEyeRef.current, targetX, targetY)
  })

  return (
    <div ref={containerRef} className="relative w-24 h-24 mx-auto">
      <motion.div
        className="absolute inset-0 rounded-full bg-gray-800 dark:bg-gray-200"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center gap-6">
        <motion.div
          className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-800"
          animate={{
            scale: isBlinking ? 0.1 : 1,
            x: Math.max(Math.min(leftEyeRef.current.x, 10), -10),
            y: Math.max(Math.min(leftEyeRef.current.y, 10), -10),
          }}
          transition={{ duration: 0.1 }}
        />
        <motion.div
          className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-800"
          animate={{
            scale: isBlinking ? 0.1 : 1,
            x: Math.max(Math.min(rightEyeRef.current.x, 10), -10),
            y: Math.max(Math.min(rightEyeRef.current.y, 10), -10),
          }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  )
}

