type FilterButtonProps = {
  label: string
}

export default function FilterButton({ label }: FilterButtonProps) {
  return (
    <button className="type-small text-fhv-black border border-fhv-black px-4 py-1 hover:bg-fhv-black hover:text-fhv-white transition-colors">
      {label}
    </button>
  )
}
