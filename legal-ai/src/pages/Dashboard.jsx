import { useEffect, useState } from 'react'
import { getConversations } from '../services/api'
import RiskBadge from '../components/RiskBadge'
import LoadingIndicator from '../components/LoadingIndicator'
export default function Dashboard({ go }) {
  const [items, setItems] = useState(null)
  useEffect(() => { getConversations().then(setItems) }, [])
  const rename = (c) => { const t = prompt('New title', c.title); if (t) setItems(items.map((x) => (x.id === c.id ? { ...x, title: t } : x))) }
  if (!items) return <div className="page"><LoadingIndicator /></div>
  return (
    <div className="page">
      <h1>My Conversations</h1>
      {items.length === 0 && <p>No consultations yet. Start one to see it here.</p>}
      {items.map((c) => (
        <div className="card row" key={c.id}>
          <div style={{ flex: 1 }}><strong>{c.title}</strong><div className="meta">{c.date}, {c.jurisdiction}, {c.category}</div></div>
          <RiskBadge level={c.risk} /><span>{c.status}</span>
          <button onClick={() => go('consultation')}>Open</button><button onClick={() => rename(c)}>Rename</button>
          <button className="danger" onClick={() => setItems(items.filter((x) => x.id !== c.id))}>Delete</button>
        </div>
      ))}
    </div>
  )
}
