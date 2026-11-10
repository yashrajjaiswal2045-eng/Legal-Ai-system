import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Consultation from './pages/Consultation'
import Documents from './pages/Documents'
import Drafts from './pages/Drafts'
import ReviewDashboard from './pages/ReviewDashboard'
import Settings from './pages/Settings'
const TITLES = { dashboard: 'My Conversations', consultation: 'New Consultation', documents: 'Documents', drafts: 'Drafts', review: 'Review Status', settings: 'Settings' }
export default function App() {
  const [page, setPage] = useState('landing') // simple state-based routing, no router library
  const [jurisdiction, setJurisdiction] = useState({ country: 'India', state: 'West Bengal', domain: 'Consumer' })
  if (page === 'landing') return <Landing start={() => setPage('consultation')} upload={() => setPage('documents')} />
  const pages = {
    dashboard: <Dashboard go={setPage} />, consultation: <Consultation jurisdiction={jurisdiction} go={setPage} />, documents: <Documents />,
    drafts: <Drafts jurisdiction={jurisdiction} />, review: <ReviewDashboard />, settings: <Settings />,
  }
  return (
    <div className="app">
      <Sidebar page={page} go={setPage} logout={() => setPage('landing')} />
      <div className="main"><Navbar title={TITLES[page]} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} />{pages[page]}</div>
    </div>
  )
}
