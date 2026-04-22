'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Search, X, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface UseRecentSearchesReturn {
  searches: string[]
  add: (q: string) => void
  remove: (q: string) => void
  clear: () => void
}

interface SearchBarProps {
  value: string
  onChange: (q: string) => void
  recentSearches: UseRecentSearchesReturn
}

export function SearchBar({ value, onChange, recentSearches }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync external value changes (e.g. from saved search restore)
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value
      setInputValue(q)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        onChange(q)
      }, 300)
    },
    [onChange]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        onChange(inputValue.trim())
        recentSearches.add(inputValue.trim())
        setFocused(false)
        ;(e.target as HTMLInputElement).blur()
      }
      if (e.key === 'Escape') {
        setFocused(false)
        ;(e.target as HTMLInputElement).blur()
      }
    },
    [inputValue, onChange, recentSearches]
  )

  const handleClear = useCallback(() => {
    setInputValue('')
    onChange('')
  }, [onChange])

  const handleSelectRecent = useCallback(
    (q: string) => {
      setInputValue(q)
      onChange(q)
      recentSearches.add(q)
      setFocused(false)
    },
    [onChange, recentSearches]
  )

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const showDropdown = focused && recentSearches.searches.length > 0 && !inputValue

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search recipes, chefs, and more..."
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          className="pl-9 pr-9"
          aria-label="Search"
          autoComplete="off"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 h-7 w-7"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Recent searches dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border bg-popover shadow-md overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="text-xs font-medium text-muted-foreground">Recent searches</span>
            <button
              onClick={recentSearches.clear}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
          <ul>
            {recentSearches.searches.map((q) => (
              <li key={q} className="flex items-center gap-2 px-3 py-2 hover:bg-accent group">
                <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <button
                  className="flex-1 text-left text-sm truncate"
                  onClick={() => handleSelectRecent(q)}
                >
                  {q}
                </button>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    recentSearches.remove(q)
                  }}
                  aria-label={`Remove "${q}" from recent searches`}
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
