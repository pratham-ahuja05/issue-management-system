import React from 'react'

export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null
  const prev = () => onPage(Math.max(1, page - 1))
  const next = () => onPage(Math.min(totalPages, page + 1))
  return (
    <div className="flex items-center justify-between mt-6 px-4">
      <button onClick={prev} disabled={page === 1} className="btn-secondary disabled:opacity-30 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>
      <span className="text-sm font-medium text-[#A1A1AA] light:text-gray-600">Page <span className="text-[#F5F5F7] light:text-gray-900">{page}</span> of <span className="text-[#F5F5F7] light:text-gray-900">{totalPages}</span></span>
      <button onClick={next} disabled={page === totalPages} className="btn-secondary disabled:opacity-30 flex items-center gap-2">
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
