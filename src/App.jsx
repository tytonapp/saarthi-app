import { useState } from 'react'
import AddSlot from './components/Sugam/AddSlot'
import DailyView from './components/Sugam/DailyView'

export default function App() {
  const [refresh, setRefresh] = useState(0)

  const triggerRefresh = () => setRefresh(prev => prev + 1)

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1>Saarthi</h1>
        <div style={styles.status}>● Connected to Sugam Engine</div>
      </header>

      <main style={styles.main}>
        <div style={styles.column}>
          <DailyView refreshTrigger={refresh} />
        </div>
        <div style={styles.column}>
          <AddSlot onRefresh={triggerRefresh} />
        </div>
      </main>

      <footer style={styles.footer}>
        Modules Active: <strong>Sugam</strong> | Coming Soon: <strong>Utsav</strong>
      </footer>
    </div>
  )
}

const styles = {
  app: { fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f5f7fa', minHeight: '100vh', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  status: { fontSize: '0.8rem', color: '#27ae60', background: '#eafaf1', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold' },
  main: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' },
  footer: { textAlign: 'center', marginTop: '40px', color: '#999', fontSize: '0.9rem' }
}