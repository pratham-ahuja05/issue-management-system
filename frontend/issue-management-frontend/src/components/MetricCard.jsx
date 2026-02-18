import React, { useEffect, useState } from 'react'

const ICONS = {
  total: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  open: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  resolved: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  high: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
}

export default function MetricCard({ title, value, icon = 'total', trend, className = '' }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(value) || 0
    if (start === end) return

    const duration = 800
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1f] to-[#111116] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 light:from-white light:to-gray-50 light:shadow-lg ${className}`}
         style={{ border: '1px solid rgba(255, 255, 255, 0.06)' }}>
      
      {/* Background Icon */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] light:opacity-[0.02] transition-opacity duration-300 group-hover:opacity-[0.05]">
        <svg className="w-32 h-32 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {ICONS[icon]}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#71717A] light:text-gray-500">
            {title}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend > 0 ? 'text-emerald-400 light:text-emerald-600' : 'text-red-400 light:text-red-600'
            }`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={trend > 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
              </svg>
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <div className="text-5xl font-bold text-[#F5F5F7] light:text-gray-900 transition-transform duration-300 group-hover:scale-[1.02] tabular-nums">
          {displayValue}
        </div>

        {/* Decorative Icon */}
        <div className="absolute bottom-6 right-6 opacity-20 light:opacity-10 transition-all duration-300 group-hover:opacity-30 group-hover:scale-110">
          <svg className="w-8 h-8 text-blue-400 light:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {ICONS[icon]}
          </svg>
        </div>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
           style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.05), transparent 70%)' }} />
    </div>
  )
}