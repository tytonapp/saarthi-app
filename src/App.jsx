import { useState } from 'react'
import AddSlot from './components/Sugam/AddSlot'
import DailyView from './components/Sugam/DailyView'
import EventForm from './components/Utsav/EventForm'

export default function App() {
  const [activeTab, setActiveTab] = useState('sugam')
  const [refresh, setRefresh] = useState(0)

  const triggerRefresh = () => setRefresh(prev => prev + 1)

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1>Saarthi</h1>
        <nav style={styles.nav}>
          <button 
            style={activeTab === 'sugam' ? styles.activeBtn : styles.navBtn} 
            onClick={() => setActiveTab('sugam')}
          >
            Sugam (Daily)
          </button>
          <button 
            style={activeTab === 'utsav' ? styles.activeBtn : styles.navBtn} 
            onClick={() => setActiveTab('utsav')}
          >
            Utsav (Yearly)
          </button>
        </nav>
      </header>

      <main style={styles.main}>
        {activeTab === 'sugam' ? (
          <div style={styles.grid}>
            <DailyView refreshTrigger={refresh} />
            <AddSlot onRefresh={triggerRefresh} />
          </div>
        ) : (
          <div style={styles.grid}>
            <section style={styles.placeholder}>
              <h3>📅 Upcoming Events</h3>
              <p>Calendar view coming soon...</p>
            </section>
            <EventForm onRefresh={triggerRefresh} />
          </div>
        )}
      </main>
    </div>
  )
}

const styles = {
  app: { fontFamily: 'Inter, sans-serif', backgroundColor: '#f5f7fa', minHeight: '100vh', padding: '20px' },
  header: { maxWidth: '1000px', margin: '0 auto 30px auto', textAlign: 'center' },
  nav: { display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' },
  navBtn: { padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: '#ddd' },
  activeBtn: { padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: '#4A90E2', color: 'white', fontWeight: 'bold' },
  main: { maxWidth: '1000px', margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' },
  placeholder: { background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }
}