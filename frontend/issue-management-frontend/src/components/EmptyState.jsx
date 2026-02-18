import React from 'react'

export default function EmptyState({ title='No data', subtitle='Nothing to show yet', action }){
  return (
    <div className="card-base text-center py-20">
      <div className="inline-flex w-24 h-24 bg-gradient-to-br from-blue-500/10 to-violet-600/10 rounded-3xl items-center justify-center mb-6 ring-1 ring-white/10">
        <svg className="w-12 h-12 text-[#71717A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-[#F5F5F7] mb-3">{title}</h3>
      <p className="text-sm text-[#71717A] mb-8 max-w-md mx-auto">{subtitle}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
