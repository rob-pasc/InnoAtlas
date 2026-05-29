export type TopicColorConfig = {
  /** Full Tailwind bg class – used directly on elements. Must be a literal
   *  string so Tailwind's scanner generates the class. */
  bg: string
  /** Hex value for non-Tailwind contexts (Leaflet SVG markers, canvas, etc.) */
  hex: string
}

export const TOPIC_COLORS: Record<string, TopicColorConfig> = {
  'Mobilität':           { bg: 'bg-fhv-sky-blue',          hex: '#9ACFF1' },
  'Energieeffizienz':    { bg: 'bg-fhv-zine-yellow',       hex: '#FFDC5F' },
  'Kreislaufwirtschaft': { bg: 'bg-fhv-periwinkle-lilac',  hex: '#C0A1CC' },
  'Technik':             { bg: 'bg-fhv-sunrise-red',       hex: '#ED6E4C' },
}
