import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Issues from './pages/Issues'
import IssueDetails from './pages/IssueDetails'
import CreateIssue from './pages/CreateIssue'
import Login from './pages/Login'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Layout from './layout/Layout'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
      <Route path="/issues/create" element={<ProtectedRoute><CreateIssue /></ProtectedRoute>} />
      <Route path="/issues/:id" element={<ProtectedRoute><IssueDetails /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
    </Routes>
  )
}
