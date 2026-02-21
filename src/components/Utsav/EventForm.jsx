import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function EventForm({ onRefresh }) {
  const [formData, setFormData] = useState({
    event_name: '',
    start_date: '',
    end_date: '',
    event_type: 'holiday',
    affects_timetable: true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('utsav_events').insert([formData])
    if (error) alert(error.message)
    else {
      setFormData({ event_name: '', start_date: '', end_date: '', event_type: 'holiday', affects_timetable: true })
      if (onRefresh) onRefresh()
      alert("Event added to Utsav!")
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={{marginTop: 0}}>🎉 Add Utsav Event</h3>
      <input 
        style={styles.input} 
        placeholder="Event Name (e.g. Diwali)" 
        value={formData.event_name}
        onChange={e => setFormData({...formData, event_name: e.target.value})} 
        required 
      />
      <div style={{display: 'flex', gap: '10px'}}>
        <input type="date" style={styles.input} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
        <input type="date" style={styles.input} onChange={e => setFormData({...formData, end_date: e.target.value})} required />
      </div>
      <select style={styles.input} value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value})}>
        <option value="holiday">Holiday</option>
        <option value="exam">Exam</option>
        <option value="cultural">Cultural</option>
      </select>
      <button type="submit" style={styles.btn}>Save Event</button>
    </form>
  )
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', background: '#fff9db', borderRadius: '12px', border: '1px solid #fab005' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc' },
  btn: { padding: '10px', background: '#f08c00', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
}