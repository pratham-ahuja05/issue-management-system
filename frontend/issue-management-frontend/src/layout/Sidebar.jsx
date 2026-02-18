import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import { FiHome, FiList, FiPlusSquare, FiSettings } from 'react-icons/fi'

const items = [
  { to: '/', label: 'Dashboard', icon: <FiHome /> },
  { to: '/issues', label: 'Issues', icon: <FiList /> },
  { to: '/issues/create', label: 'Create Issue', icon: <FiPlusSquare /> }
]

export default function Sidebar(){
  const { user } = useAuth()
  
  return (
    <aside className="w-64 sidebar p-6">
      <div className="mb-8">
        <Logo />
      </div>
      <nav className="flex flex-col gap-2">
        {items.map(i => (
          <NavLink key={i.to} to={i.to} end className={({isActive})=>`nav-link ${isActive? 'active':''}`}>
            <span className="text-xl">{i.icon}</span>
            <span>{i.label}</span>
          </NavLink>
        ))}

        {user && user.role === 'ADMIN' && (
          <NavLink to="/admin" className={({isActive})=>`nav-link ${isActive? 'active':''}`}>
            <FiSettings className="text-xl" /> <span>Admin</span>
          </NavLink>
        )}
      </nav>
    </aside>
  )
}
