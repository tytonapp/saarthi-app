import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [status, setStatus] = useState('Checking connection...')

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('sugam_slots').select('*').limit(1)
        
        if (error) {
          setStatus('❌ Connection Failed: ' + error.message)
        } else {
          setStatus('✅ Saarthi is connected to Supabase!')
          console.log('Data check:', data)
        }
      } catch (err) {
        setStatus('❌ Error: Could not reach Supabase.')
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Saarthi Dashboard</h1>
      <div style={{ 
        padding: '20px', 
        borderRadius: '8px', 
        backgroundColor: status.includes('✅') ? '#e6fffa' : '#fff5f5',
        border: `1px solid ${status.includes('✅') ? '#38b2ac' : '#feb2b2'}`
      }}>
        <p>{status}</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Modules:</h3>
        <ul>
          <li><strong>Sugam:</strong> Daily Flow (Timetable)</li>
          <li><strong>Utsav:</strong> Yearly Rhythm (Events)</li>
        </ul>
      </div>
    </div>
  )
}

// THIS IS THE LINE YOU WERE MISSING:
export default App