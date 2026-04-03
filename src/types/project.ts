export type Partner = {
  name: string
  link: string | null
}

export type Project = {
  id: number
  title: string
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
    /** Split on comma — supports future multi-value entries */
    country: string[]
    topic: string[]
    industry: string[]
    status: string[]
    lab: string[]
  }

  image: {
    link: string | null
    credits: string | null
  }
}
