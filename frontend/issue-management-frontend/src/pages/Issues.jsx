import React, { useState } from 'react'
import Layout from '../layout/Layout'
import useFetch from '../hooks/useFetch'
import { api } from '../services/api'
import IssueTable from '../components/IssueTable'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Issues(){
  const { data, loading, refetch } = useFetch(()=> api.getIssues(), [])
  const issues = data || []
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const nav = useNavigate()
  const { user } = useAuth()

  React.useEffect(() => {
    refetch()
  }, [])

  const filtered = issues.filter(i=> (i.title + ' ' + i.description).toLowerCase().includes(query.toLowerCase()) && (status? i.status===status : true))

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <input placeholder="Search issues..." value={query} onChange={e=>setQuery(e.target.value)} className="input-field w-full" />
        </div>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="select-field">
          <option value="">All statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>
      <div className="card-base">
        {loading ? <LoadingSkeleton /> : <IssueTable issues={filtered} onRow={(i)=> nav(`/issues/${i.id}`)} />}
      </div>
    </Layout>
  )
}
