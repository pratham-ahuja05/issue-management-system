export default function SimilarityBar({ similarity }) {
  // Convert decimal (0-1) to percentage (0-100) if needed
  const similarityPercent = similarity > 1 ? Math.round(similarity) : Math.round(similarity * 100)
  
  const getColor = () => {
    if (similarityPercent > 80) return 'bg-red-500'
    if (similarityPercent > 50) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getTextColor = () => {
    if (similarityPercent > 80) return 'text-red-400'
    if (similarityPercent > 50) return 'text-yellow-400'
    return 'text-blue-400'
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-[#A1A1AA]">Similarity</span>
        <span className={`text-xs font-semibold ${getTextColor()}`}>{similarityPercent}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor()} transition-all duration-500 ease-out`}
          style={{ width: `${similarityPercent}%` }}
        />
      </div>
    </div>
  )
}
