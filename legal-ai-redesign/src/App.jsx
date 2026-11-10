import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Consultation from './pages/Consultation'
import Documents from './pages/Documents'
import Drafts from './pages/Drafts'
import ReviewDashboard from './pages/ReviewDashboard'
import Settings from './pages/Settings'

const TITLES = {
  dashboard: ['Dashboard', 'Overview'],
  consultation: ['Consultation', 'Informational guidance'],
  drafts: ['Draft Document', 'Create an editable draft'],
  documents: ['Documents', 'Uploads and drafts'],
  review: ['Review', 'Human review queue'],
  settings: ['Settings', 'Preferences'],
}

export default function App() {
  const [page, setPage] = useState('landing') // simple state-based navigation, no router library
  const [jurisdiction, setJurisdiction] = useState({ country: 'India', state: 'West Bengal', domain: 'Consumer' })
  const [messages, setMessages] = useState([]) // kept here so the chat survives switching pages
  const [library, setLibrary] = useState({ uploads: [], drafts: [], downloads: [] })
  const [drawer, setDrawer] = useState(false)
  const main = useRef(null)
  const first = useRef(true)

  const go = (p) => { setPage(p); setDrawer(false); window.scrollTo(0, 0) }
  const addToLibrary = (kind, item) => setLibrary((l) => ({ ...l, [kind]: [item, ...l[kind].filter((x) => x.id !== item.id)] }))
  const removeFromLibrary = (kind, id) => setLibrary((l) => ({ ...l, [kind]: l[kind].filter((x) => x.id !== id) }))

  useEffect(() => { // move focus to the new page for keyboard and screen-reader users
    if (first.current) { first.current = false; return }
    main.current?.focus({ preventScroll: true })
  }, [page])

  if (page === 'landing') return <Landing start={() => go('consultation')} draft={() => go('drafts')} upload={() => go('documents')} />

  const pages = {
    dashboard: <Dashboard go={go} messages={messages} library={library} />,
    consultation: <Consultation jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} messages={messages} setMessages={setMessages} go={go} />,
    documents: <Documents library={library} addToLibrary={addToLibrary} removeFromLibrary={removeFromLibrary} go={go} />,
    drafts: <Drafts jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} addToLibrary={addToLibrary} />,
    review: <ReviewDashboard />,
    settings: <Settings jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} />,
  }
  const [title, subtitle] = TITLES[page]
  return (
    <div className="shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <Sidebar page={page} go={go} logout={() => go('landing')} open={drawer} onClose={() => setDrawer(false)} />
      <div className="shell-main">
        <Navbar title={title} subtitle={subtitle} jurisdiction={jurisdiction} onMenu={() => setDrawer(true)} />
        <main id="main" ref={main} tabIndex={-1} style={{ outline: 'none' }}>{pages[page]}</main>
      </div>
    </div>
  )
}
