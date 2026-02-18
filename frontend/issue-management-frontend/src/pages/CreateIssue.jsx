import React, { useState } from 'react'
import Layout from '../layout/Layout'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { useNavigate } from 'react-router-dom'
import PriorityBadge from '../components/PriorityBadge'

export default function CreateIssue(){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saved, setSaved] = useState(null)
  const toast = useToast()
  const { user } = useAuth()
  const nav = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (e)=>{
    if(e && e.preventDefault) e.preventDefault()
    try{
      setIsSubmitting(true)
      const payload = {
        title,
        description,
        reporter: user?.email || (()=>{ try{ const me = JSON.parse(localStorage.getItem('ai_user')); return me?.email }catch(e){return undefined} })(),
        createdAt: new Date().toISOString()
      }

      const res = await api.createIssue(payload)
      setSaved(res)
      toast.add('Issue created', 'info')
      nav('/issues')
    }catch(err){ console.error('create issue error', err); toast.add(err.message, 'error') }
    finally{ setIsSubmitting(false) }
  }

  return (
    <Layout>
      <div className="card-base max-w-2xl mx-auto">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-[#F5F5F7] light:text-gray-900 tracking-tight">Create New Issue</h3>
          <p className="text-sm text-[#A1A1AA] light:text-gray-600 mt-2">AI will automatically analyze and categorize your issue</p>
        </div>
        <form onSubmit={(e)=>e.preventDefault()} className="space-y-5" action="#">
          <div>
            <label className="block text-sm font-medium text-[#A1A1AA] light:text-gray-600 mb-3 uppercase tracking-wider">Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="input-field" placeholder="Brief description of the issue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#A1A1AA] light:text-gray-600 mb-3 uppercase tracking-wider">Description</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} className="input-field" rows={6} placeholder="Provide detailed information about the issue..." />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={()=>nav('/issues')} className="btn-secondary">Cancel</button>
            <button type="button" onClick={submit} disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : 'Create Issue'}
            </button>
          </div>
        </form>

        {saved && (
          <div className="mt-8 p-6 bg-gradient-to-br from-blue-500/10 to-violet-600/10 light:from-blue-50 light:to-violet-50 rounded-2xl border border-blue-500/30 light:border-blue-200 backdrop-blur-xl">
            <h4 className="font-semibold text-lg text-[#F5F5F7] light:text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400 light:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Analysis Complete
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><strong className="text-[#A1A1AA] light:text-gray-700">Priority:</strong> <PriorityBadge p={saved.aiPriority} /></div>
              <div className="flex items-center gap-2"><strong className="text-[#A1A1AA] light:text-gray-700">Category:</strong> <span className="px-3 py-1 bg-white/10 light:bg-white rounded-lg text-[#F5F5F7] light:text-gray-900 font-medium">{saved.aiCategory}</span></div>
              <div className="mt-4"><strong className="text-[#A1A1AA] light:text-gray-700">Summary:</strong> <p className="mt-2 text-[#F5F5F7] light:text-gray-900 leading-relaxed">{saved.aiSummary}</p></div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
