import { useEffect, useState } from 'react'

export default function useFetch(fn, deps = []){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [trigger, setTrigger] = useState(0)
  
  useEffect(()=>{
    let mounted = true
    setLoading(true); setError(null)
    fn().then(res => mounted && setData(res)).catch(err => mounted && setError(err.message || String(err))).finally(()=> mounted && setLoading(false))
    return ()=> mounted = false
  }, [...deps, trigger])
  
  const refetch = () => setTrigger(t => t + 1)
  
  return { data, loading, error, refetch }
}
