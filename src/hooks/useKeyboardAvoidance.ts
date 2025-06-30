import { useEffect, useRef } from 'react'

// Usage: const containerRef = useKeyboardAvoidance();
// <div ref={containerRef}>...</div>
export function useKeyboardAvoidance(padding = 120) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run on mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) return

    const handleFocus = (e: Event) => {
      if (containerRef.current && e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        containerRef.current.style.paddingBottom = `${padding}px`
        // Optionally scroll input into view
        setTimeout(() => {
          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    }
    const handleBlur = () => {
      if (containerRef.current) {
        containerRef.current.style.paddingBottom = ''
      }
    }
    document.addEventListener('focusin', handleFocus)
    document.addEventListener('focusout', handleBlur)
    return () => {
      document.removeEventListener('focusin', handleFocus)
      document.removeEventListener('focusout', handleBlur)
    }
  }, [padding])

  return containerRef
} 