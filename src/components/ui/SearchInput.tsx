type SearchInputProps = {
  value:        string
  onChange:     (value: string) => void
  placeholder?: string
}

export default function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="type-copy text-fhv-black bg-fhv-white border border-fhv-black w-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-fhv-black"
    />
  )
}
