export type Partner = {
  name: string
  link: string | null
}

export type Project = {
  id: number
  title: string
  /** If set, this project is pinned to the top of the list at this position (1 = first). Null = alphabetical. */
  displayOrder: number | null
  subtitle: string | null
  description: string | null
  objective: string | null
  results: string | null
  website: string

  location: {
    city: string
    longitude: number
    latitude: number
  }

  contact: {
    name: string | null
    organisation: string | null
    email: string | null
    phone: string | null
  }

  duration: {
    start: string | null
    end: string | null
    time: string | null
  }

  partners: {
    lead: Partner
    others: Partner[]
  }

  filters: {
    /** Split on comma – supports future multi-value entries */
    country: string[]
    topic: string[]
    fokus: string[]
    status: string[]
    lab: string[]
  }

  image: {
    link: string | null
    credits: string | null
  }
}
