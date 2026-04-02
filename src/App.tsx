import { useState } from 'react'

const swatches = [
  { label: 'accent',         bg: 'bg-accent',         text: 'text-bg' },
  { label: 'accent / 50',    bg: 'bg-accent/50',      text: 'text-heading' },
  { label: 'accent / 20',    bg: 'bg-accent/20',      text: 'text-heading' },
  { label: 'border',         bg: 'bg-border',         text: 'text-heading' },
  { label: 'code-bg',        bg: 'bg-code-bg',        text: 'text-heading' },
  { label: 'bg',             bg: 'bg-bg border border-border', text: 'text-heading' },
]

export default function App() {
  const [dark, setDark] = useState(false)

  function toggleDark() {
    document.documentElement.classList.toggle('dark', !dark)
    setDark(!dark)
  }

  return (
    <div className="min-h-screen bg-bg px-8 py-12">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-heading">
            Tailwind color showcase
          </h1>
          <button
            onClick={toggleDark}
            className="rounded-lg border border-border bg-code-bg px-4 py-2 text-sm text-heading transition-colors hover:bg-accent/10"
          >
            {dark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>

        {/* Color swatches */}
        <section className="mb-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-text">
            Color tokens
          </p>
          <div className="grid grid-cols-2 gap-3">
            {swatches.map(({ label, bg, text }) => (
              <div
                key={label}
                className={`${bg} ${text} flex h-16 items-center justify-center rounded-lg text-sm font-mono`}
              >
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* Card example */}
        <section className="mb-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-text">
            Card
          </p>
          <div className="rounded-xl border border-border bg-code-bg p-6">
            <h2 className="mb-2 text-lg font-semibold text-heading">Card title</h2>
            <p className="mb-4 text-sm text-text">
              Border and background come from custom tokens.
              The accent button below uses opacity modifiers.
            </p>
            <div className="flex gap-2">
              <button className="rounded-md bg-accent px-4 py-2 text-sm text-bg transition-colors hover:bg-accent/80">
                Primary
              </button>
              <button className="rounded-md bg-accent/15 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/25">
                Secondary
              </button>
            </div>
          </div>
        </section>

        {/* Code block */}
        <section>
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-text">
            How to add a color
          </p>
          <pre className="overflow-x-auto rounded-lg bg-code-bg p-4 text-xs text-heading">
            {[
              '/* 1. Define in index.css */',
              ':root    { --brand: 210 80% 50%; }',
              '.dark    { --brand: 210 70% 65%; }',
              '',
              '/* 2. Register in @theme inline */',
              '--color-brand: hsl(var(--brand));',
              '',
              '/* 3. Use anywhere */',
              '<div className="bg-brand text-bg bg-brand/30" />',
            ].join('\n')}
          </pre>
        </section>

      </div>
    </div>
  )
}
