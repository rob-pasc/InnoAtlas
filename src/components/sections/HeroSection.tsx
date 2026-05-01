type HeroSectionProps = {
  heading: string
  subheading: string
  body: string
}

export default function HeroSection({ heading, subheading, body }: HeroSectionProps) {
  return (
    <section className="bg-fhv-white px-4 py-8 md:px-16 md:py-16">
      <div className="flex">
        <div className="w-0 md:w-1.5 shrink-0 self-stretch bg-fhv-sky-blue" aria-hidden="true" />

        <div className="flex-1 md:pl-5">
          <h1 className="type-hero text-fhv-black mb-4">{heading}</h1>
          <h2 className="type-h2 text-fhv-black mb-6">{subheading}</h2>
          <p className="type-copy text-fhv-black max-w-2xl">{body}</p>
        </div>
      </div>
    </section>
  )
}
