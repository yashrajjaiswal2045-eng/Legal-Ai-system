import { useState } from 'react'
import DocumentUpload from '../components/DocumentUpload'
import DocumentCard from '../components/DocumentCard'
const TABS = {
  'Uploaded Documents': [{ name: 'rental-agreement.pdf', type: 'PDF', date: '2026-09-30', status: 'Processed' }],
  'Generated Drafts': [{ name: 'consumer-complaint.docx', type: 'DOCX', date: '2026-10-01', status: 'Draft' }],
  'Downloaded Documents': [{ name: 'rti-application.pdf', type: 'PDF', date: '2026-09-27', status: 'Downloaded' }],
}
export default function Documents() {
  const [tab, setTab] = useState('Uploaded Documents')
  const [extra, setExtra] = useState([])
  return (
    <div className="page">
      <h1>Documents</h1>
      <div className="row tabs">{Object.keys(TABS).map((t) => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
      <br />
      {tab === 'Uploaded Documents' && <DocumentUpload onDone={(f) => setExtra([...extra, { name: f.name, type: f.name.split('.').pop().toUpperCase(), date: new Date().toISOString().slice(0, 10), status: 'Processed' }])} />}
      {[...(tab === 'Uploaded Documents' ? extra : []), ...TABS[tab]].map((d) => <DocumentCard key={d.name} doc={d} />)}
    </div>
  )
}
