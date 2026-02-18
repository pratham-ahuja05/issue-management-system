import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }){
  const [dark] = useState(true) // Always dark

  useEffect(()=>{
    // Always dark mode
    document.documentElement.classList.remove('light')
    document.body.classList.remove('light')
  }, [])

  return <ThemeContext.Provider value={{ dark, toggle: () => {} }}>{children}</ThemeContext.Provider>
}

export function useTheme(){ return useContext(ThemeContext) }
