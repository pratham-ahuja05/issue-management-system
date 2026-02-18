import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

const instance = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' }
})

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      console.error('API network error', err)
      return Promise.reject(new Error(`Network error: could not reach backend at ${BASE}`))
    }
    const message = err.response.data && err.response.data.message ? err.response.data.message : err.response.statusText
    console.error('API error', { url: err.config && err.config.url, status: err.response.status, body: err.response.data })
    return Promise.reject(new Error(message))
  }
)

instance.interceptors.request.use((config)=>{
  try{
    const raw = localStorage.getItem('ai_user')
    if(raw){
      const u = JSON.parse(raw)
      if(u && u.email){ config.headers['X-User-Email'] = u.email }
      if(u && u.role){ config.headers['X-User-Role'] = u.role }
      if(u && u.name){ config.headers['X-User-Name'] = u.name }
    }
  }catch(e){}
  try{
    const token = localStorage.getItem('ai_token')
    if(token) config.headers['Authorization'] = `Bearer ${token}`
  }catch(e){}
  return config
})

export const api = {
  getIssues: async (params='') => {
    try{
      const res = await instance.get(`/issues${params ? params : '?size=1000'}`)
      const data = res.data
      if (Array.isArray(data)) return data
      if (data && Array.isArray(data.content)) return data.content
      if (data && Array.isArray(data.data)) return data.data
      return []
    }catch(e){ console.error('getIssues failed', e); throw e }
  },
  getIssue: async (id) => {
    try{
      const res = await instance.get(`/issues/${id}`)
      return (res.data && (res.data.content || res.data || res.data.data)) || null
    }catch(e){ console.error('getIssue failed', e); throw e }
  },
  createIssue: async (payload) => {
    try{
      const res = await instance.post('/issues', payload)
      return res.data
    }catch(e){ console.error('createIssue failed', e); throw e }
  },
  updateIssue: async (id, payload) => {
    try{
      const res = await instance.put(`/issues/${id}`, payload)
      return res.data
    }catch(e){ console.error('updateIssue failed', e); throw e }
  },
  deleteIssue: async (id) => {
    try{
      const res = await instance.delete(`/issues/${id}`)
      return res.data
    }catch(e){ console.error('deleteIssue failed', e); throw e }
  },
  restoreIssue: async (id) => {
    try{
      const res = await instance.put(`/issues/${id}/restore`)
      return res.data
    }catch(e){ console.error('restoreIssue failed', e); throw e }
  },
  searchIssues: async (q) => {
    try{
      const res = await instance.get(`/issues/search?query=${encodeURIComponent(q)}`)
      return Array.isArray(res.data) ? res.data : (res.data.content || [])
    }catch(e){ console.error('searchIssues failed', e); throw e }
  },
  markDuplicate: async (issueId, duplicateId) => {
    try{
      // Try the new endpoint first
      const res = await instance.post(`/issues/${issueId}/mark-duplicate`, { duplicateId })
      return res.data
    }catch(e){ 
      console.error('markDuplicate failed:', e)
      // If endpoint doesn't exist, try updating status as duplicate via update endpoint
      try {
        const res = await instance.put(`/issues/${issueId}`, { duplicateOf: duplicateId })
        return res.data
      } catch(fallbackErr) {
        console.error('fallback markDuplicate also failed', fallbackErr)
        throw new Error('Backend endpoint /issues/{id}/mark-duplicate not found. Please implement it in your backend.')
      }
    }
  }
}

