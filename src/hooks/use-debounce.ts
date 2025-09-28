'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook untuk debounce value
 * Berguna untuk menunda eksekusi hingga user selesai mengetik
 * 
 * @param value - Value yang akan di-debounce
 * @param delay - Delay dalam milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set timeout untuk mengupdate debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup timeout jika value berubah sebelum delay selesai
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}