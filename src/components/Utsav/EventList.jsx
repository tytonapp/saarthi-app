import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function EventList({ refreshTrigger }) {
  const [events, setEvents] = useState([])

  const fetchEvents = async () => {
    const { data } = await supabase.from('utsav_events').select('*').order('start_date', { ascending: true })
    setEvents(data || [])
  }

  useEffect(() => { fetchEvents() }, [refreshTrigger])

  return (
    <div style={styles.container}>
      <h3>🗓️ Upcoming Events</h3>
      {events.map(e => (
        <div key={e.id} style={{...styles.card, borderLeftColor: e.event_type === 'holiday' ? '#ff7675' : '#fdcb6e'}}>
          <strong>{e.event_name}</strong>
          <div style={{fontSize: '0.8rem'}}>{e.start_date} to {e.end_date}</div>
          <span style={styles.badge}>{e.event_type}</span>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  card: { padding: '10px', marginBottom: '10px', background: '#f9f9f9', borderLeft: '5px solid #ddd', borderRadius: '4px', position: 'relative' },
  badge: { fontSize: '0.7rem', position: 'absolute', top: '10px', right: '10px', background: '#eee', padding: '2px 6px', borderRadius: '10px' }
}