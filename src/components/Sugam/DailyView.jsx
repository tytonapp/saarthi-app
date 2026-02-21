import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

// refreshTrigger allows App.jsx to signal this component to update
export default function DailyView({ refreshTrigger }) {
  const [todaySlots, setTodaySlots] = useState([])
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const today = dayNames[new Date().getDay()]

  // 1. Fetch logic to get classes for the current day
  async function fetchToday() {
    const { data, error } = await supabase
      .from('sugam_slots')
      .select('*')
      .eq('day_of_week', today)
      .order('start_time', { ascending: true })
    
    if (error) console.error("Error fetching today's slots:", error.message)
    else setTodaySlots(data || [])
  }

  // Runs whenever the day changes or a new slot is added via the form
  useEffect(() => {
    fetchToday()
  }, [today, refreshTrigger])

  // 2. Logic to update Lesson Notes in Supabase
  const updateNotes = async (id, notes) => {
    const { error } = await supabase
      .from('sugam_slots')
      .update({ lesson_notes: notes })
      .eq('id', id)
    
    if (error) console.error("Error updating notes:", error.message)
  }

  // 3. Delete Function to remove a class
  const deleteSlot = async (id) => {
    if (window.confirm("Remove this class from your daily flow?")) {
      const { error } = await supabase
        .from('sugam_slots')
        .delete()
        .eq('id', id)
      
      if (error) alert(error.message)
      else fetchToday() 
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
              <div style={styles.headerRow}>
                <div>
                  <strong>{slot.subject_name}</strong>
                  <span style={styles.subText}> — {slot.class_name}</span>
                </div>
                <button 
                  onClick={() => deleteSlot(slot.id)} 
                  style={styles.deleteBtn}
                  title="Delete Slot"
                >
                  ✕
                </button>
              </div>

              {/* Lesson Notes Section */}
              <textarea 
                style={styles.noteInput}
                placeholder="Write lesson notes or objectives here..."
                defaultValue={slot.lesson_notes}
                onBlur={(e) => updateNotes(slot.id, e.target.value)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  )
}

const styles = {
  container: { padding: '20px', background: '#ffffff', borderRadius: '15px', border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: '400px' },
  title: { fontSize: '1.2rem', color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' },
  row: { display: 'flex', alignItems: 'flex-start', marginBottom: '20px', padding: '15px', borderRadius: '12px', background: '#f8f9fa', border: '1px solid #edf2f7' },
  time: { fontWeight: 'bold', color: '#4A90E2', width: '60px', borderRight: '2px solid #ddd', marginRight: '15px', marginTop: '5px' },
  details: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  subText: { fontSize: '0.9rem', color: '#718096', marginLeft: '5px' },
  noteInput: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical', minHeight: '60px', background: '#fff', color: '#4a5568' },
  empty: { color: '#95a5a6', fontStyle: 'italic', textAlign: 'center', marginTop: '50px' },
  deleteBtn: { background: 'none', border: 'none', color: '#cbd5e0', cursor: 'pointer', fontSize: '1.1rem', transition: 'color 0.2s' }
}