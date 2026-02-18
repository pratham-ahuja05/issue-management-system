import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import SimilarityBar from './SimilarityBar'
import KeywordHighlight from './KeywordHighlight'

export default function DuplicateCard({ duplicate, onMarkDuplicate }) {
  const nav = useNavigate()

  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1a1f] to-[#111116] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
      style={{ border: '1px solid rgba(255, 255, 255, 0.06)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1" onClick={() => nav(`/issues/${duplicate.id}`)}>
          <h4 className="font-semibold text-[#F5F5F7] mb-2 hover:text-blue-400 transition-colors">
            <KeywordHighlight text={duplicate.title} keywords={duplicate.matchedKeywords} />
          </h4>
        </div>
        <StatusBadge status={duplicate.status} />
      </div>

      <SimilarityBar similarity={duplicate.similarity} />

      {duplicate.matchedKeywords && duplicate.matchedKeywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {duplicate.matchedKeywords.map((keyword, idx) => (
            <span key={idx} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
              {keyword}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation()
          onMarkDuplicate(duplicate.id)
        }}
        className="mt-4 w-full bg-white/5 hover:bg-white/10 text-[#F5F5F7] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        Mark as Duplicate
      </button>

      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
           style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.05), transparent 70%)' }} />
    </div>
  )
}
