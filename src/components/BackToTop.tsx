import React from 'react'
import { ChevronUp } from 'lucide-react'

interface BackToTopProps {
  show: boolean
  onClick: () => void
}

export function BackToTop({ show, onClick }: BackToTopProps) {
  if (!show) return null

  return (
    <button
      onClick={onClick}
      className="
        fixed left-6 bottom-6 z-50
        w-12 h-12 bg-blue-600 text-white rounded-full
        shadow-lg hover:bg-blue-700 hover:shadow-xl
        transition-all duration-300 ease-in-out
        flex items-center justify-center
        transform hover:scale-110
      "
      title="Back to top"
      aria-label="Scroll to top of page"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  )
} 