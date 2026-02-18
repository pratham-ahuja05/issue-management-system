import React from 'react'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'

export default function IssueTable({ issues, onRow }){
  if(!issues || issues.length===0) return <div className="p-8 text-center text-[#71717A] light:text-gray-500">No issues found</div>
  return (
    <div className="overflow-hidden rounded-2xl bg-[#111218]/50 light:bg-white backdrop-blur-xl" style={{border: '1px solid rgba(255, 255, 255, 0.08)'}}>
      <table className="w-full text-left">
        <thead className="bg-white/5 light:bg-gray-50" style={{borderBottom: '1px solid rgba(255, 255, 255, 0.08)'}}>
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-[#A1A1AA] light:text-gray-600 uppercase tracking-wider">Title</th>
            <th className="px-6 py-4 text-xs font-semibold text-[#A1A1AA] light:text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-[#A1A1AA] light:text-gray-600 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-4 text-xs font-semibold text-[#A1A1AA] light:text-gray-600 uppercase tracking-wider">Updated</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(i => (
            <tr key={i.id} className="clickable-row group" onClick={()=> onRow && onRow(i)}>
              <td className="px-6 py-4 font-medium text-[#F5F5F7] light:text-gray-900 group-hover:text-blue-400 transition-colors">{i.title}</td>
              <td className="px-6 py-4"><StatusBadge status={i.status} /></td>
              <td className="px-6 py-4"><PriorityBadge p={i.aiPriority} /></td>
              <td className="px-6 py-4 text-sm text-[#71717A] light:text-gray-500">{new Date(i.updatedAt || i.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
