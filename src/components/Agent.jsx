import { useState, useEffect } from 'react'
// Since Agent is in src/components/, go up one level to reach src, then into lib
import { supabase } from '../lib/supabaseClient'

export default function SaarthiAgent({ refreshTrigger }) {
  const [briefing, setBriefing] = useState("Analyzing your day...")
  const [loading, setLoading] = useState(true)

  // Get today's date in YYYY-MM-DD format for Utsav
  const todayDate = new Date().toISOString().split('T')[0]
  // Get today's name for Sugam
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const todayName = dayNames[new Date().getDay()]

  useEffect(() => {
    async function runAnalysis() {
      setLoading(true)
      
      // 1. Check Utsav for any events/holidays today
      const { data: events } = await supabase
        .from('utsav_events')
        .select('*')
        .lte('start_date', todayDate)
        .gte('end_date', todayDate)

      // 2. Check Sugam for classes today
      const { data: slots } = await supabase
        .from('sugam_slots')
        .select('*')
        .eq('day_of_week', todayName)

      // 3. Logic to generate the briefing
      if (events && events.length > 0) {
        const event = events[0];
        if (event.event_type === 'holiday') {
          setBriefing(`Enjoy your day! Today is ${event.event_name}. Saarthi suggests taking a break from the usual ${slots?.length || 0} classes.`);
        } else {
          setBriefing(`Today is ${event.event_name}. Don't forget to adjust your materials for ${slots?.length || 0} classes.`);
        }
      } else if (slots && slots.length > 0) {
        setBriefing(`You have ${slots.length} classes today. Your first session is ${slots[0].subject_name} for ${slots[0].class_name} at ${slots[0].start_time.slice(0,5)}.`);
      } else {
        setBriefing("Your schedule looks clear today. A great time to catch up on lesson planning for Sugam!");
      }
      
      setLoading(false)
    }

    runAnalysis()
  }, [refreshTrigger, todayDate, todayName])

  return (
    <div style={styles.agentBox}>
      <div style={styles.iconContainer}>
        <span style={styles.botIcon}>🤖</span>
      </div>
      <div style={styles.textContainer}>
        <h4 style={styles.agentTitle}>Saarthi Agent</h4>
        <p style={styles.briefingText}>
          {loading ? "Refreshing insights..." : briefing}
        </p>
      </div>
    </div>
  )
}

const styles = {
  agentBox: { 
    display: 'flex', 
    gap: '20px', 
    alignItems: 'center', 
    background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', 
    padding: '20px', 
    borderRadius: '16px', 
    border: '1px solid #7dd3fc', 
    marginBottom: '25px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  iconContainer: {
    background: '#fff',
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.8rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  textContainer: { flex: 1 },
  agentTitle: { margin: '0 0 4px 0', color: '#0369a1', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  briefingText: { margin: 0, color: '#0c4a6e', fontSize: '1.05rem', lineHeight: '1.4', fontWeight: '500' }
}