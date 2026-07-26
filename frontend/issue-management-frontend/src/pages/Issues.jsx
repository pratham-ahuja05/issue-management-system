import React, { useEffect, useState } from 'react'
import Layout from '../layout/Layout'
import { api } from '../services/api'
import IssueTable from '../components/IssueTable'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useNavigate } from 'react-router-dom'

const PAGE_SIZE = 20

export default function Issues(){
  const [issues, setIssues] = useState([])
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query.trim())
      setPage(0)
    }, 300)
    return () => clearTimeout(handle)
  }, [query])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const params = { page, size: PAGE_SIZE, status }
        const response = debouncedQuery
          ? await api.searchIssues(debouncedQuery, params)
          : await api.getIssuesPage(params)

        if (!mounted) return
        setIssues(response.items || [])
        setTotalPages(response.totalPages || 0)
      } catch (e) {
        if (!mounted) return
        setIssues([])
        setTotalPages(0)
        setError(e.message || 'Failed to load issues')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [debouncedQuery, status, page])

  const canPrev = page > 0
  const canNext = page + 1 < Math.max(totalPages, 1)

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <input placeholder="Search issues..." value={query} onChange={e=>setQuery(e.target.value)} className="input-field w-full" />
        </div>
        <select value={status} onChange={e=>{ setStatus(e.target.value); setPage(0) }} className="select-field">
          <option value="">All statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>
      <div className="card-base space-y-4">
        {loading ? <LoadingSkeleton /> : <IssueTable issues={issues} onRow={(i)=> nav(`/issues/${i.id}`)} />}
        {!loading && error && <div className="text-sm text-red-400">{error}</div>}
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#71717A]">Page {page + 1} of {Math.max(totalPages, 1)}</div>
          <div className="flex gap-2">
            <button className="btn-secondary" disabled={!canPrev || loading} onClick={()=> setPage((p) => Math.max(0, p - 1))}>Previous</button>
            <button className="btn-secondary" disabled={!canNext || loading} onClick={()=> setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
