import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

// We add { refreshTrigger } as a prop so App.jsx can tell this component to update
export default function DailyView({ refreshTrigger }) {
  const [todaySlots, setTodaySlots] = useState([])
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const today = dayNames[new Date().getDay()]

  // 1. Fetch logic inside a reusable function
  async function fetchToday() {
    const { data, error } = await supabase
      .from('sugam_slots')
      .select('*')
      .eq('day_of_week', today)
      .order('start_time', { ascending: true })
    
    if (error) console.error("Error fetching today's slots:", error.message)
    else setTodaySlots(data || [])
  }

  // 2. Added refreshTrigger to the dependency array
  // This means: "Whenever refreshTrigger changes, run fetchToday again"
  useEffect(() => {
    fetchToday()
  }, [today, refreshTrigger])

  // 3. New Delete Function
  const deleteSlot = async (id) => {
    if (window.confirm("Remove this class from your daily flow?")) {
      const { error } = await supabase
        .from('sugam_slots')
        .delete()
        .eq('id', id)
      
      if (error) alert(error.message)
      else fetchToday() // Refresh the list locally after deleting
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📍 Today's Focus ({today})</h2>
      
      {todaySlots.length === 0 ? (
        <p style={styles.empty}>No classes scheduled for today. Enjoy your break!</p>
      ) : (
        todaySlots.map((slot) => (
          <div key={slot.id} style={styles.row}>
            <div style={styles.time}>{slot.start_time.slice(0, 5)}</div>
            <div style={styles.details}>
              <strong>{slot.subject_name}</strong>
              <span style={styles.subText}>{slot.class_name}</span>
            </div>
            {/* Added a simple delete button */}
            <button 
              onClick={() => deleteSlot(slot.id)} 
              style={styles.deleteBtn}
              title="Delete Slot"
            >
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  )
}

const styles = {
  container: { padding: '20px', background: '#ffffff', borderRadius: '15px', border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: '300px' },
  title: { fontSize: '1.2rem', color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' },
  row: { display: 'flex', alignItems: 'center', marginBottom: '15px', padding: '12px', borderRadius: '10px', background: '#f8f9fa', position: 'relative', border: '1px solid transparent', transition: '0.3s' },
  time: { fontWeight: 'bold', color: '#4A90E2', width: '60px', borderRight: '2px solid #ddd', marginRight: '15px' },
  details: { display: 'flex', flexDirection: 'column', flex: 1 },
  subText: { fontSize: '0.85rem', color: '#7f8c8d' },
  empty: { color: '#95a5a6', fontStyle: 'italic', textAlign: 'center', marginTop: '50px' },
  deleteBtn: { background: 'none', border: 'none', color: '#fab1a0', cursor: 'pointer', fontSize: '1.2rem', padding: '0 10px', marginLeft: '10px' }
}