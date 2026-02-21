import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Connection Error:', error.message)
      } else {
        console.log('Connection Successful! Session:', data)
      }
    }

    testConnection()
  }, [])

  return <div>Testing Saarthi Connectivity...</div>
}