import { useEffect, useRef } from 'react'

/** Lightweight canvas confetti burst — no dependencies. Runs ~3.5s then idles. */
export default function Confetti({ active }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = ['#f5a623', '#e07b00', '#3fae6a', '#ef6f6c', '#5b8def', '#fff']
    const pieces = Array.from({ length: 160 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: (Math.random() * 6 + 4) * dpr,
      c: colors[(Math.random() * colors.length) | 0],
      vy: (Math.random() * 2 + 2) * dpr,
      vx: (Math.random() - 0.5) * 2 * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
    }))

    const start = performance.now()
    const draw = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pieces.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        p.vy += 0.02 * dpr
        if (p.y > canvas.height + 20) {
          p.y = -20
          p.x = Math.random() * canvas.width
        }
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.c
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6)
        ctx.restore()
      })
      if (now - start < 5000) rafRef.current = requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  if (!active) return null
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  )
}
