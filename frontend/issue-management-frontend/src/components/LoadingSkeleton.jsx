export default function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl animate-pulse" style={{border: '1px solid rgba(255, 255, 255, 0.05)'}}>
          <div className="flex-1 h-4 bg-white/10 rounded"></div>
          <div className="w-24 h-4 bg-white/10 rounded"></div>
          <div className="w-24 h-4 bg-white/10 rounded"></div>
        </div>
      ))}
    </div>
  )
}
