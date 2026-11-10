import { useEffect, useState } from 'react'
import { getReviewStatus } from '../services/api'
import ReviewCard from '../components/ReviewCard'
import CitationCard from '../components/CitationCard'
import VerificationPanel from '../components/VerificationPanel'
import LoadingIndicator from '../components/LoadingIndicator'
export default function ReviewDashboard() {
  const [cases, setCases] = useState(null)
  const [open, setOpen] = useState(null)
  useEffect(() => { getReviewStatus().then(setCases) }, [])
  const decide = (status) => { setCases(cases.map((c) => (c.id === open.id ? { ...c, status } : c))); setOpen(null) }
  if (!cases) return <div className="page"><LoadingIndicator /></div>
  if (open) return (
    <div className="page">
      <button onClick={() => setOpen(null)}>Back to reviews</button>
      <h1>{open.title}</h1>
      <div className="card"><h3>Original question</h3><p>{open.question}</p></div>
      <div className="card"><h3>Extracted facts</h3><ul>{open.facts.map((f) => <li key={f}>{f}</li>)}</ul></div>
      <div className="card"><h3>AI reasoning summary</h3><p>{open.reasoning}</p></div>
      <div className="card"><h3>Draft document</h3><pre style={{ whiteSpace: 'pre-wrap' }}>{open.draft}</pre></div>
      <h3>Retrieved sources and citations</h3>{open.sources.map((s) => <CitationCard key={s.id} source={s} />)}
      <VerificationPanel checks={{ citations: true, dates: true, names: true, fields: false, consistency: true }} />
      <div className="row"><button className="primary" onClick={() => decide('Approved')}>Approve</button><button onClick={() => alert('Edit mode (demo)')}>Edit</button>
        <button className="danger" onClick={() => decide('Rejected')}>Reject</button><button onClick={() => decide('Escalated')}>Escalate</button></div>
    </div>
  )
  return <div className="page"><h1>Pending Reviews</h1>{cases.map((c) => <ReviewCard key={c.id} item={c} onOpen={() => setOpen(c)} />)}</div>
}
