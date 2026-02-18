import React, { useMemo } from 'react'
import Layout from '../layout/Layout'
import MetricCard from '../components/MetricCard'
import { api } from '../services/api'
import useFetch from '../hooks/useFetch'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, LineChart, Line } from 'recharts'

const COLORS = ['#2563eb','#f97316','#16a34a','#7c3aed','#ec4899','#ef4444']

export default function Analytics(){
  const { data } = useFetch(()=> api.getIssues(), [])
  const issues = data || []
  
  // Calculate system-wide metrics
  const total = issues.length
  const resolved = issues.filter(i=>i.status==='RESOLVED').length
  const open = issues.filter(i=>i.status==='OPEN').length
  const resolutionRate = total > 0 ? Math.round((resolved/total)*100) : 0
  
  const cat = {}
  const pri = {}
  const byStatus = {}
  const byAssignee = {}
  
  issues.forEach(i=>{ 
    cat[i.aiCategory || 'Uncategorized']= (cat[i.aiCategory || 'Uncategorized']||0)+1
    pri[i.aiPriority || 'N/A']=(pri[i.aiPriority || 'N/A']||0)+1
    byStatus[i.status] = (byStatus[i.status]||0)+1
    byAssignee[i.assignedTo || 'Unassigned'] = (byAssignee[i.assignedTo]||0)+1
  })
  
  const catData = Object.keys(cat).map(k=>({ name:k, value:cat[k] }))
  const priData = Object.keys(pri).map(k=>({ name:k, value:pri[k] }))
  const statusData = Object.keys(byStatus).map((k,i)=>({ name:k, value:byStatus[k], fill:COLORS[i%COLORS.length] }))
  const assigneeData = Object.keys(byAssignee).slice(0,5).map(k=>({ name:k, value:byAssignee[k] }))
  
  const trend = useMemo(()=>{
    const byDay = {}
    issues.forEach(i=>{
      const day = new Date(i.createdAt).toISOString().slice(0,10)
      byDay[day] = (byDay[day]||0)+1
    })
    return Object.keys(byDay).sort().map(k=>({ date:k, count:byDay[k] }))
  }, [issues])

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive insights across all issues</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Issues" value={total} icon="total" />
        <MetricCard title="Open Issues" value={open} icon="open" />
        <MetricCard title="Resolved" value={resolved} icon="resolved" />
        <MetricCard title="Resolution Rate" value={`${resolutionRate}%`} icon="resolved" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card-base">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Issues Trend</h3>
          <div style={{height:240}}>
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
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Status Distribution</h3>
          <div style={{height:240}}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {statusData.map((entry, i)=>(<Cell key={i} fill={entry.fill} />))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-base">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Category Distribution</h3>
          <div style={{height:240}}>
            <ResponsiveContainer>
              <BarChart data={catData} layout="vertical">
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-base">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Priority Breakdown</h3>
          <div style={{height:240}}>
            <ResponsiveContainer>
              <BarChart data={priData}>
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="value" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  )
}
