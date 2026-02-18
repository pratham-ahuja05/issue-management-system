import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try{ return JSON.parse(localStorage.getItem('ai_user')) }catch{ return null }
  })

  useEffect(()=>{ localStorage.setItem('ai_user', JSON.stringify(user)) }, [user])

  const login = (email) => {
    const role = email === 'admin@test.com' ? 'ADMIN' : 'USER'
    const u = { email, role, name: email.split('@')[0] }
    setUser(u)
    return u
  }

  const logout = ()=>{ setUser(null); localStorage.removeItem('ai_user') }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){ return useContext(AuthContext) }
