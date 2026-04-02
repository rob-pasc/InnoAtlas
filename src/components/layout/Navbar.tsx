import LogoS from '../../assets/icons/fhv-logo-s.svg?react'

export default function Navbar() {
  return (
    <nav className="bg-fhv-white flex items-center gap-3 px-16 py-4">
      <LogoS className="h-[46px] w-auto text-fhv-black" />
      <span className="type-copy-em text-fhv-black">InnoAtlas</span>
    </nav>
  )
}
