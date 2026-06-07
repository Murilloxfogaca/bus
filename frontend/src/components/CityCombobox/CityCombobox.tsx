import { useState, useRef, useEffect, useCallback } from 'react'

interface Props {
  id?: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  options: string[]
  placeholder?: string
  error?: string
  disabled?: boolean
}

export function CityCombobox({
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = 'Selecione...',
  error,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActiveIndex(-1)
    onBlur()
  }, [onBlur])

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [close])

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement
      el?.scrollIntoView?.({ block: 'nearest' })
    }
  }, [activeIndex])

  function handleSelect(option: string) {
    onChange(option)
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
      if (!open) setOpen(true)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(filtered[activeIndex])
    } else if (e.key === 'Escape') {
      close()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">
        {label}
      </label>

      <div
        className={`flex items-center border rounded-lg bg-white transition-all ${
          open
            ? 'ring-2 ring-blue-500 border-blue-500'
            : error
              ? 'border-red-400'
              : 'border-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="pl-3 text-slate-400 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </span>

        <input
          id={id}
          type="text"
          value={open ? query : value}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
            if (e.target.value === '') onChange('')
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={!open && value ? value : placeholder}
          disabled={disabled}
          autoComplete="off"
          className="flex-1 outline-none px-2 py-2 text-slate-800 bg-transparent text-sm disabled:cursor-not-allowed"
        />

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => (open ? close() : setOpen(true))}
          className="px-2 py-2 text-slate-400 hover:text-slate-600 flex-shrink-0 disabled:cursor-not-allowed"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-52 overflow-y-auto"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-slate-400 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Nenhuma cidade encontrada
            </li>
          ) : (
            filtered.map((option, i) => (
              <li
                key={option}
                role="option"
                aria-selected={value === option}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelect(option)
                }}
                className={`px-3 py-2.5 text-sm cursor-pointer flex items-center gap-2 ${
                  i === activeIndex
                    ? 'bg-blue-100 text-blue-800'
                    : value === option
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {option}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
