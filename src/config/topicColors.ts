export type TopicColorConfig = {
  /** Full Tailwind bg class – used directly on elements. Must be a literal
   *  string so Tailwind's scanner generates the class. */
  bg: string
  /** CSS custom property holding the same colour, for non-Tailwind contexts
   *  (Leaflet SVG markers) that can't read Tailwind classes. Resolved at
   *  runtime via getComputedStyle – the single source of truth is the
   *  variable's definition in src/index.css. */
  token: string
}

export const TOPIC_COLORS: Record<string, TopicColorConfig> = {
  'Mobilität':           { bg: 'bg-cat-1', token: '--cat-1' },
  'Energieeffizienz':    { bg: 'bg-cat-2', token: '--cat-2' },
  'Kreislaufwirtschaft': { bg: 'bg-cat-3', token: '--cat-3' },
  'Technik':             { bg: 'bg-cat-4', token: '--cat-4' },
}
