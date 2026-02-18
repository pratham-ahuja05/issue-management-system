import React from 'react'

const STATUS = {
  OPEN: 'bg-blue-500/20 ring-1 ring-blue-500/30 text-blue-300',
  IN_PROGRESS: 'bg-orange-500/20 ring-1 ring-orange-500/30 text-orange-300',
  RESOLVED: 'bg-emerald-500/20 ring-1 ring-emerald-500/30 text-emerald-300',
  CLOSED: 'bg-gray-500/20 ring-1 ring-gray-500/30 text-gray-300',
  POSSIBLE_DUPLICATE: 'bg-violet-500/20 ring-1 ring-violet-500/30 text-violet-300'
}

export default function StatusBadge({ status }){
  const cls = STATUS[status] || 'bg-gray-500/20 ring-1 ring-gray-500/30 text-gray-300'
  const text = status?.replace('_',' ').replace('POSSIBLE DUPLICATE', 'DUPLICATE')
  return <span className={`pill ${cls}`}>{text}</span>
}
