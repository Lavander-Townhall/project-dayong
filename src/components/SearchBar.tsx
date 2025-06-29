import React from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Search participants..." }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-6 w-6 text-gray-400" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-12 pr-12 py-4 text-lg
          bg-white border-2 border-gray-200 rounded-xl
          focus:border-blue-500 focus:ring-0 focus:outline-none
          placeholder-gray-400
          transition-colors duration-200
        "
      />
      
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
        >
          <X className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors" />
        </button>
      )}
    </div>
  )
}