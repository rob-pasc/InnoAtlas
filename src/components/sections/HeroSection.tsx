type HeroSectionProps = {
  heading: string
  subheading: string
  body: string
}

export default function HeroSection({ heading, subheading, body }: HeroSectionProps) {
  return (
    <section className="bg-paper px-4 py-8 md:px-16 md:pb-16 md:pt-14">
      <div className="flex">
        <div className="w-0 md:w-1.5 shrink-0 self-stretch bg-cat-1" aria-hidden="true" />

        <div className="flex-1 md:pl-5">
          <h1 className="type-hero text-ink mb-3">{heading}</h1>
          <h2 className="type-h2 text-ink/55 mb-3 leading-none max-w-2xl">{subheading}</h2>
          <p className="type-copy text-ink max-w-2xl">{body}</p>
        </div>
      </div>
    </section>
  )
}
