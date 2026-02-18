import React, { useEffect, useState } from 'react'
import Layout from '../layout/Layout'
import { api } from '../services/api'
import { useParams, useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import LoadingSkeleton from '../components/LoadingSkeleton'
import EmptyState from '../components/EmptyState'
import DuplicateCard from '../components/DuplicateCard'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

export default function IssueDetails(){
  const { id } = useParams()
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedDuplicateId, setSelectedDuplicateId] = useState(null)
  const { user } = useAuth()
  const toast = useToast()
  const nav = useNavigate()

  useEffect(()=>{
    if(!id || id === 'undefined') {
      setLoading(false)
      return
    }
    setLoading(true)
    api.getIssue(id).then(r=> {
      console.log('Issue details:', r)
      if (r.possibleDuplicates) {
        console.log('Possible duplicates:', r.possibleDuplicates)
      }
      setIssue(r)
    }).catch(e=> toast.add(e.message,'error')).finally(()=> setLoading(false))
  }, [id])

  const changeStatus = async (s)=>{
    try{ await api.updateIssue(id, {...issue, status: s}); const res = await api.getIssue(id); setIssue(res); toast.add('Status updated') }catch(e){ toast.add(e.message,'error') }
  }

  const handleMarkDuplicate = (duplicateId) => {
    setSelectedDuplicateId(duplicateId)
    setShowModal(true)
  }

  const confirmMarkDuplicate = async () => {
    try {
      await api.markDuplicate(id, selectedDuplicateId)
      toast.add('Marked as duplicate successfully')
      setShowModal(false)
      const res = await api.getIssue(id)
      setIssue(res)
    } catch (e) {
      console.error('Mark duplicate error:', e)
      toast.add(e.message || 'Failed to mark as duplicate', 'error')
    }
  }

  if(loading) return <Layout><div className="card-base"><LoadingSkeleton rows={1} /></div></Layout>
  if(!issue) return <Layout><EmptyState title="Issue not found" subtitle="This issue may have been deleted" /></Layout>

  return (
    <Layout>
      <div className="card-base max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-bold text-[#F5F5F7] light:text-gray-900 tracking-tight">{issue.title}</h2>
            <div className="mt-3 flex items-center gap-4 text-sm text-[#71717A] light:text-gray-500">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(issue.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <StatusBadge status={issue.status} />
            <PriorityBadge p={issue.aiPriority} />
          </div>
        </div>

        <div className="prose max-w-none mb-8 p-6 bg-white/5 light:bg-gray-50 backdrop-blur-sm rounded-2xl text-[#F5F5F7] light:text-gray-900 leading-relaxed border border-white/10 light:border-gray-200">{issue.description}</div>

        <div className="p-6 bg-gradient-to-br from-blue-500/10 to-violet-600/10 light:from-blue-50 light:to-violet-50 rounded-2xl border border-blue-500/30 light:border-blue-200 backdrop-blur-xl">
          <h4 className="font-semibold text-lg text-[#F5F5F7] light:text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400 light:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Summary
          </h4>
          <div className="text-sm text-[#F5F5F7] light:text-gray-900 leading-relaxed">{issue.aiSummary}</div>
        </div>

        {issue.possibleDuplicates && issue.possibleDuplicates.length > 0 ? (
          <div className="mt-8">
            <h4 className="font-semibold text-xl text-[#F5F5F7] mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Possible Duplicates
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issue.possibleDuplicates.map((dup) => (
                <DuplicateCard 
                  key={dup.id} 
                  duplicate={dup} 
                  onMarkDuplicate={handleMarkDuplicate}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 p-8 bg-white/5 rounded-2xl border border-white/10 text-center">
            <svg className="w-12 h-12 text-[#71717A] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#A1A1AA]">No similar issues found</p>
          </div>
        )}

        {user && user.role === 'ADMIN' && (
          <div className="mt-6 p-6 bg-white/5 light:bg-gray-50 backdrop-blur-sm rounded-2xl border border-white/10 light:border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] light:text-gray-600 mb-3 uppercase tracking-wider">Update Status</label>
              <select value={issue.status} onChange={e=> changeStatus(e.target.value)} className="select-field">
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
            <button onClick={async ()=>{ if(confirm('Delete this issue?')){ try{ await api.deleteIssue(id); toast.add('Issue deleted'); nav('/issues') }catch(e){ toast.add(e.message, 'error') }}}} className="w-full bg-red-500/20 light:bg-red-50 border border-red-500/30 light:border-red-200 text-red-300 light:text-red-600 px-4 py-3 rounded-xl font-medium hover:bg-red-500/30 light:hover:bg-red-100 transition-all duration-200">
              Delete Issue
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmMarkDuplicate}
        title="Mark as Duplicate"
        message="Are you sure you want to mark this issue as a duplicate?"
      />
    </Layout>
  )
}

