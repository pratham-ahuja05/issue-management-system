import React from 'react'
import Layout from '../layout/Layout'
import useFetch from '../hooks/useFetch'
import { api } from '../services/api'
import MetricCard from '../components/MetricCard'

export default function Admin(){
  const { data } = useFetch(()=> api.getIssues(), [])
  const issues = data || []
  
  const stats = {
    total: issues.length,
    deleted: issues.filter(i => i.deleted).length,
    highPriority: issues.filter(i => i.aiPriority === 'HIGH').length,
    openIssues: issues.filter(i => i.status === 'OPEN').length
  }

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 light:text-blue-600">Admin Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300 light:text-gray-600 mt-1">System overview and management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Issues" value={stats.total} />
        <MetricCard title="Open Issues" value={stats.openIssues} />
        <MetricCard title="High Priority" value={stats.highPriority} />
        <MetricCard title="Deleted" value={stats.deleted} />
      </div>

      <div className="card-base">
        <h3 className="font-semibold text-lg text-blue-600 dark:text-blue-400 light:text-blue-600 mb-4">System Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 light:border-gray-200">
            <span className="text-blue-500 dark:text-blue-300 light:text-blue-500">Backend URL</span>
            <span className="font-medium text-blue-600 dark:text-blue-400 light:text-blue-600">http://localhost:8080</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 light:border-gray-200">
            <span className="text-blue-500 dark:text-blue-300 light:text-blue-500">API Version</span>
            <span className="font-medium text-blue-600 dark:text-blue-400 light:text-blue-600">v1.0</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-blue-500 dark:text-blue-300 light:text-blue-500">Environment</span>
            <span className="font-medium text-blue-600 dark:text-blue-400 light:text-blue-600">Development</span>
          </div>
        </div>
      </div>
    </Layout>
  )
}
