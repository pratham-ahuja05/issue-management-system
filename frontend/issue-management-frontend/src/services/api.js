import axios from 'axios'

const mode = import.meta.env.MODE
const configuredBase = (import.meta.env.VITE_API_BASE || '').trim()
const BASE = mode === 'production' ? configuredBase : '/api'

if (mode === 'production' && !BASE) {
  throw new Error('Missing VITE_API_BASE for production build/runtime. Set it to your backend absolute URL.')
}

const instance = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' }
})

const extractMessage = (responseData, fallback) => {
  if (!responseData) return fallback
  if (typeof responseData.message === 'string' && responseData.message.trim()) return responseData.message
  if (responseData.message && typeof responseData.message === 'object') return 'Validation failed'
  if (typeof responseData.error === 'string' && responseData.error.trim()) return responseData.error
  return fallback
}

const parsePage = (data) => {
  if (Array.isArray(data)) {
    return {
      content: data,
      page: 0,
      size: data.length,
      totalElements: data.length,
      totalPages: 1
    }
  }

  if (data && Array.isArray(data.content)) {
    return {
      content: data.content,
      page: Number.isInteger(data.number) ? data.number : 0,
      size: Number.isInteger(data.size) ? data.size : data.content.length,
      totalElements: Number.isInteger(data.totalElements) ? data.totalElements : data.content.length,
      totalPages: Number.isInteger(data.totalPages) ? data.totalPages : 1
    }
  }

  if (data && Array.isArray(data.data)) {
    return {
      content: data.data,
      page: 0,
      size: data.data.length,
      totalElements: data.data.length,
      totalPages: 1
    }
  }

  return { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0 }
}

const buildQuery = (params = {}) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    q.set(key, value)
  })
  const built = q.toString()
  return built ? `?${built}` : ''
}

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      console.error('API network error', err)
      return Promise.reject(new Error(`Network error: could not reach backend at ${BASE}`))
    }
    const message = extractMessage(err.response.data, err.response.statusText)
    console.error('API error', { url: err.config && err.config.url, status: err.response.status, body: err.response.data })
    return Promise.reject(new Error(message))
  }
)

instance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('ai_token')
    if (token) config.headers['Authorization'] = 'Bearer ' + token
  } catch (e) {}
  return config
})

export const api = {
  getIssues: async (params = {}) => {
    try {
      const query = typeof params === 'string' ? params : buildQuery({ page: 0, size: 100, ...params })
      const res = await instance.get(`/issues${query}`)
      return parsePage(res.data).content
    } catch (e) {
      console.error('getIssues failed', e)
      throw e
    }
  },
  getIssuesPage: async (params = {}) => {
    try {
      const res = await instance.get(`/issues${buildQuery({ page: 0, size: 20, ...params })}`)
      const page = parsePage(res.data)
      return {
        items: page.content,
        page: page.page,
        size: page.size,
        totalElements: page.totalElements,
        totalPages: page.totalPages
      }
    } catch (e) {
      console.error('getIssuesPage failed', e)
      throw e
    }
  },
  getIssue: async (id) => {
    try {
      const res = await instance.get(`/issues/${id}`)
      const data = res.data
      if (!data) return null
      if (data.data) return data.data
      if (data.content && !Array.isArray(data.content)) return data.content
      return data
    } catch (e) {
      console.error('getIssue failed', e)
      throw e
    }
  },
  createIssue: async (payload) => {
    try {
      const res = await instance.post('/issues', payload)
      return res.data
    } catch (e) {
      console.error('createIssue failed', e)
      throw e
    }
  },
  updateIssue: async (id, payload) => {
    try {
      const res = await instance.put(`/issues/${id}`, payload)
      return res.data
    } catch (e) {
      console.error('updateIssue failed', e)
      throw e
    }
  },
  deleteIssue: async (id) => {
    try {
      const res = await instance.delete(`/issues/${id}`)
      return res.data
    } catch (e) {
      console.error('deleteIssue failed', e)
      throw e
    }
  },
  restoreIssue: async (id) => {
    try {
      const res = await instance.put(`/issues/${id}/restore`)
      return res.data
    } catch (e) {
      console.error('restoreIssue failed', e)
      throw e
    }
  },
  searchIssues: async (q, params = {}) => {
    try {
      const res = await instance.get(`/issues/search${buildQuery({ query: q, page: 0, size: 20, ...params })}`)
      const page = parsePage(res.data)
      return {
        items: page.content,
        page: page.page,
        size: page.size,
        totalElements: page.totalElements,
        totalPages: page.totalPages
      }
    } catch (e) {
      console.error('searchIssues failed', e)
      throw e
    }
  },
  markDuplicate: async (issueId, duplicateId) => {
    try {
      const res = await instance.post(`/issues/${issueId}/mark-duplicate`, { duplicateId })
      return res.data
    } catch (e) {
      console.error('markDuplicate failed:', e)
      try {
        const res = await instance.put(`/issues/${issueId}`, { duplicateOf: duplicateId })
        return res.data
      } catch (fallbackErr) {
        console.error('fallback markDuplicate also failed', fallbackErr)
        throw new Error('Backend endpoint /issues/{id}/mark-duplicate not found. Please implement it in your backend.')
      }
    }
  }
}
