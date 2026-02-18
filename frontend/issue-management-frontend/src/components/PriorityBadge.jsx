import React from 'react'

const MAP = { 
  HIGH: 'bg-red-500/20 ring-1 ring-red-500/30 text-red-300', 
  MEDIUM: 'bg-amber-500/20 ring-1 ring-amber-500/30 text-amber-300', 
  LOW: 'bg-emerald-500/20 ring-1 ring-emerald-500/30 text-emerald-300' 
}
export default function PriorityBadge({ p }){
  const cls = MAP[p] || 'bg-gray-500/20 ring-1 ring-gray-500/30 text-gray-300'
  return <span className={`pill ${cls}`}>{p || 'N/A'}</span>
}
