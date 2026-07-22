type SearchInputProps = {
  value:        string
  onChange:     (value: string) => void
  placeholder?: string
  id?:          string
}

export default function SearchInput({ value, onChange, placeholder, id }: SearchInputProps) {
  return (
    <input
      type="text"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="type-copy [text-box:normal] text-ink bg-paper border border-ink w-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-ink"
    />
  )
}
