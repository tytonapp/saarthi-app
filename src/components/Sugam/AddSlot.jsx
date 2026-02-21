import { useState } from 'react'
// Verify this path: since AddSlot is in src/components/Sugam, 
// we go up two levels (..) to reach src, then into lib.
import { supabase } from '../../lib/supabaseClient' 

export default function AddSlot({ onRefresh }) {
  const [formData, setFormData] = useState({
    day_of_week: 'Monday',
    subject_name: '',
    class_name: '',
    start_time: '',
    end_time: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Safety check: End time must be after Start time
    if (formData.start_time >= formData.end_time) {
      alert("End time must be after start time!")
      return
    }

    // 1. Send the data to Supabase
    const { error } = await supabase.from('sugam_slots').insert([formData])
    
    if (error) {
      alert("Error: " + error.message)
    } else {
      // 2. Clear the form except the day to keep it "Sugam" (Easy)
      setFormData({ 
        day_of_week: formData.day_of_week, // Keep the same day for next entry
        subject_name: '', 
        class_name: '', 
        start_time: '', 
        end_time: '' 
      })
      
      // 3. This triggers the DailyView to update instantly
      if (onRefresh) onRefresh() 
      
      alert("Class saved successfully!")
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={{marginTop: 0, color: '#2C3E50'}}>➕ Add New Class</h3>
      
      <label style={styles.label}>Day of the Week</label>
      <select 
        style={styles.input}
        value={formData.day_of_week} 
        onChange={e => setFormData({...formData, day_of_week: e.target.value})}
      >
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>

      <label style={styles.label}>Subject & Class</label>
      <input 
        style={styles.input}
        placeholder="e.g. Science" 
        value={formData.subject_name} 
        onChange={e => setFormData({...formData, subject_name: e.target.value})} 
        required 
      />

      <input 
        style={styles.input}
        placeholder="e.g. Standard 6-A" 
        value={formData.class_name} 
        onChange={e => setFormData({...formData, class_name: e.target.value})} 
        required 
      />

      <div style={{display: 'flex', gap: '10px'}}>
        <div style={{flex: 1}}>
          <label style={styles.label}>Starts</label>
          <input 
            type="time" 
            style={styles.input} 
            value={formData.start_time} 
            onChange={e => setFormData({...formData, start_time: e.target.value})} 
            required 
          />
        </div>
        <div style={{flex: 1}}>
          <label style={styles.label}>Ends</label>
          <input 
            type="time" 
            style={styles.input} 
            value={formData.end_time} 
            onChange={e => setFormData({...formData, end_time: e.target.value})} 
            required 
          />
        </div>
      </div>

      <button type="submit" style={styles.button}>
        Save to Sugam
      </button>
    </form>
  )
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '25px', background: '#ffffff', borderRadius: '15px', border: '1px solid #e0e0e0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  label: { fontSize: '0.75rem', fontWeight: 'bold', color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #dfe6e9', width: '100%', boxSizing: 'border-box', fontSize: '1rem' },
  button: { padding: '14px', background: '#4A90E2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.3s', marginTop: '10px' }
}