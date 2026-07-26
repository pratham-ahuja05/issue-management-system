import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Issues = lazy(() => import('./pages/Issues'))
const IssueDetails = lazy(() => import('./pages/IssueDetails'))
const CreateIssue = lazy(() => import('./pages/CreateIssue'))
const Login = lazy(() => import('./pages/Login'))
const Admin = lazy(() => import('./pages/Admin'))

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#A1A1AA]">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
        <Route path="/issues/create" element={<ProtectedRoute><CreateIssue /></ProtectedRoute>} />
        <Route path="/issues/:id" element={<ProtectedRoute><IssueDetails /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      </Routes>
    </Suspense>
  )
}
