type NavbarProps = {
  onMenuToggle: () => void
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  return (
    <nav className="bg-fhv-white flex items-center px-4 md:px-16 pt-5">
      <button
        className="md:hidden mr-4 text-fhv-black flex flex-col gap-1 shrink-0"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        <span className="block w-6 h-0.5 bg-fhv-black" />
        <span className="block w-6 h-0.5 bg-fhv-black" />
        <span className="block w-6 h-0.5 bg-fhv-black" />
      </button>
      <div className="flex flex-col gap-1.5">
        <span className="type-h2 text-5xl text-fhv-black">FHV</span>
        <span className="type-h2 text-5xl text-fhv-black">InnoAtlas</span>
      </div>
    </nav>
  )
}
