export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-gradient-to-br from-[#1a1a1f] to-[#111116] rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-[#F5F5F7] mb-2">{title}</h3>
        <p className="text-[#A1A1AA] mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-primary">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
