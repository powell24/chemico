"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const ctx = el.getContext("2d")
    if (!ctx) return

    const cvs: HTMLCanvasElement = el
    const cx: CanvasRenderingContext2D = ctx

    let animId: number
    let particles: Particle[] = []
    const COUNT = 65
    const MAX_DIST = 130
    const SPEED = 0.25

    function resize() {
      cvs.width = cvs.offsetWidth
      cvs.height = cvs.offsetHeight
      initParticles()
    }

    function initParticles() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * cvs.width,
        y: Math.random() * cvs.height,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2,
        r: Math.random() * 1.2 + 0.4,
      }))
    }

    function draw() {
      cx.clearRect(0, 0, cvs.width, cvs.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = cvs.width
        if (p.x > cvs.width) p.x = 0
        if (p.y < 0) p.y = cvs.height
        if (p.y > cvs.height) p.y = 0

        cx.beginPath()
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        cx.fillStyle = "rgba(255,255,255,0.75)"
        cx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35
            cx.beginPath()
            cx.moveTo(particles[i].x, particles[i].y)
            cx.lineTo(particles[j].x, particles[j].y)
            cx.strokeStyle = `rgba(255,255,255,${alpha})`
            cx.lineWidth = 0.6
            cx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(cvs)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
