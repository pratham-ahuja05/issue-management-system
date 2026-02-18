import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function Logo({ className = '' }){
  const { dark } = useTheme()
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 12h10M7 8h10M7 16h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="brand text-xl">AI Incident</span>
    </div>
  )
}
