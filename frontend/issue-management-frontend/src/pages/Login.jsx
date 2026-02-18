import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = (e)=>{
    e.preventDefault()
    if(!email) return setError('Email required')
    if(email !== 'admin@test.com' && email !== 'user@test.com') return setError('Use admin@test.com or user@test.com')
    login(email)
    nav('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5"></div>
      <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-3xl items-center justify-center shadow-2xl shadow-blue-500/30 mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 12h10M7 8h10M7 16h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-3">AI Issue Manager</h1>
          <p className="text-[#A1A1AA]">Sign in to manage your issues</p>
        </div>
        
        <div className="card-base">
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-3 uppercase tracking-wider">Email Address</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@test.com" className="input-field" type="email" />
              <p className="mt-3 text-xs text-[#71717A]">Use admin@test.com or user@test.com</p>
            </div>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300">{error}</div>}
            <button className="btn-primary w-full">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  )
}
