import React, { createContext, useContext, useState } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])
  let counter = 0
  const add = (msg, type='info') => {
    const id = Date.now() + counter++
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(()=> setToasts(t => t.filter(x=>x.id!==id)), 4000)
  }
  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed right-4 top-4 flex flex-col gap-3 z-50">
        {toasts.map(t => (
          <div key={t.id} className={`px-5 py-3 rounded-xl backdrop-blur-xl border shadow-2xl animate-in slide-in-from-right duration-200 ${
            t.type==='error'
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
          }`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(){ return useContext(ToastContext) }

export default ToastContext
