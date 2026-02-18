import React, { useMemo } from 'react'
import Layout from '../layout/Layout'
import MetricCard from '../components/MetricCard'
import { api } from '../services/api'
import useFetch from '../hooks/useFetch'
import { BarChart, Bar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import EmptyState from '../components/EmptyState'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const COLORS = ['#2563eb','#f97316','#16a34a','#6b7280','#7c3aed']

export default function Dashboard(){
  const { user } = useAuth()
  const { data, loading } = useFetch(()=> api.getIssues(), [])
  const issues = data || []
  
  // Show all issues for now, can be filtered by backend later
  // For now, Dashboard shows all issues with user-focused presentation
  const userIssues = issues

  const total = userIssues.length
  const open = userIssues.filter(i=>i.status==='OPEN').length
  const resolved = userIssues.filter(i=>i.status==='RESOLVED').length
  const high = userIssues.filter(i=> (i.aiPriority||'').toUpperCase()==='HIGH').length

  const byStatus = useMemo(()=>{
    const map = {}
    userIssues.forEach(i=> map[i.status]=(map[i.status]||0)+1)
    return Object.keys(map).map((k,idx)=>({ name: k, value: map[k], color: COLORS[idx%COLORS.length] }))
  }, [userIssues])

  const trend = useMemo(()=>{
    const byDay = {}
    userIssues.forEach(i=>{
      const day = new Date(i.createdAt).toISOString().slice(0,10)
      byDay[day] = (byDay[day]||0)+1
    })
    return Object.keys(byDay).sort().map(k=>({ date:k, count:byDay[k] }))
  }, [userIssues])

  const priority = useMemo(()=>{
    const m = {}
    userIssues.forEach(i=>{
      const p = i.aiPriority || 'N/A'
      m[p] = (m[p]||0) + 1
    })
    return Object.keys(m).map(k=>({ name:k, value:m[k] }))
  }, [userIssues])

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">My Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Personal overview of your issues</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Issues" value={total} icon="total" />
        <MetricCard title="Open Issues" value={open} icon="open" trend={open > 0 ? 5 : 0} />
        <MetricCard title="Resolved" value={resolved} icon="resolved" trend={resolved > 0 ? 12 : 0} />
        <MetricCard title="High Priority" value={high} icon="high" trend={high > 0 ? -3 : 0} />
      </div>

      {!userIssues.length ? (
        <EmptyState 
          title="No issues yet" 
          subtitle="Create your first issue to get started with AI-powered incident management" 
          action={<Link to="/issues/create" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Issue
          </Link>} 
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card-base">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">My Issues Trend</h3>
            <div style={{ height: 240 }}>
              <ResponsiveContainer>
                <LineChart data={trend}>
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-base">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Priority Breakdown</h3>
            <div style={{ height: 240 }}>
              <ResponsiveContainer>
                <BarChart data={priority}>
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-base">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Status Distribution</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={byStatus} layout="vertical">
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-base">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/issues" className="block w-full btn-primary text-center py-2">View All My Issues</Link>
              <Link to="/issues/create" className="block w-full btn-secondary text-center py-2">Create New Issue</Link>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

