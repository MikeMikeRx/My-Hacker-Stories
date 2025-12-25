import { useState, useEffect } from "react"

// Hook to persist state in localStorage
export const useStorageState = (key: string, initialState: string) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  )

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue] as const
};