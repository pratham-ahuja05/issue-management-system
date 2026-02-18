import React from 'react'
import { useAuth } from '../context/AuthContext'
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

export default function Header(){
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  return (
    <header className="glass-surface flex items-center justify-between px-6 py-4 shadow-2xl shadow-black/20" style={{borderBottom: '1px solid rgba(255, 255, 255, 0.08)'}}>
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent tracking-tight">AI Issue Manager</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4" style={{borderLeft: '1px solid rgba(255, 255, 255, 0.1)'}}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30">{user? user.name[0].toUpperCase(): 'U'}</div>
          <div>
            <div className="text-sm font-medium text-[#F5F5F7] light:text-gray-900">{user ? user.name : 'Guest'}</div>
            <div className="text-xs text-[#71717A] light:text-gray-500">{user ? user.email : ''}</div>
          </div>
          {user && <button onClick={logout} className="ml-2 p-2 text-red-400 light:text-red-600 hover:bg-red-500/10 light:hover:bg-red-50 rounded-xl transition-all duration-200"><FiLogOut className="w-4 h-4" /></button>}
        </div>
      </div>
    </header>
  )
}
