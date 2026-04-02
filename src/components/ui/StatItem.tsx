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
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isNumeric) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return

        hasAnimated.current = true
        observer.disconnect()

        let rafId: number
        const startTime = performance.now()

        function tick(now: number) {
          const progress = Math.min((now - startTime) / DURATION, 1)
          setCount(Math.round(easeOut(progress) * target))
          if (progress < 1) rafId = requestAnimationFrame(tick)
        }

        rafId = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafId)
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
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
