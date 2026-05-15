import { useEffect, useRef, useState } from 'react'

type StatItemProps = {
  value: string
  label: string
}

const DURATION = 1500 // ms

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3) // cubic ease-out
}

export default function StatItem({ value, label }: StatItemProps) {
  const target = parseInt(value, 10)
  const isNumeric = !isNaN(target)

  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animatedTarget = useRef(-1)

  useEffect(() => {
    if (!isNumeric || target === 0) return
    if (animatedTarget.current === target) return

    const el = ref.current
    if (!el) return

    let rafId: number

    function runAnimation() {
      animatedTarget.current = target
      const startTime = performance.now()
      function tick(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / DURATION, 1)
        setCount(Math.round(easeOut(progress) * target))
        if (progress < 1) rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
    }

    // If already in viewport (e.g. data loaded while visible), animate immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      runAnimation()
      return () => cancelAnimationFrame(rafId)
    }

    // Otherwise wait until scrolled into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        runAnimation()
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [isNumeric, target])

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span className="type-h1 text-fhv-black">
        {isNumeric ? count : value}
      </span>
      <span className="type-small text-fhv-black">{label}</span>
    </div>
  )
}
