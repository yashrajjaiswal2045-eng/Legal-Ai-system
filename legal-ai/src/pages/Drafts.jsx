import { useState } from 'react'
import { generateDraft } from '../services/api'
import DraftEditor from '../components/DraftEditor'
import VerificationPanel from '../components/VerificationPanel'
import LoadingIndicator from '../components/LoadingIndicator'
const TYPES = ['Consumer Complaint', 'RTI Application', 'Rental Letter', 'Employment Letter', 'Legal Notice', 'Agreement Template']
const FIELDS = [['name', 'Full name'], ['address', 'Address'], ['opposite', 'Opposite party'], ['date', 'Date'], ['amount', 'Amount (Rs.)'], ['incident', 'Incident description'], ['facts', 'Additional facts']]
export default function Drafts({ jurisdiction }) {
  const [type, setType] = useState('')
  const [form, setForm] = useState({})
  const [draft, setDraft] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const generate = async () => {
    if (!form.name || !form.incident) return setError('Full name and incident description are required.')
    setError(''); setLoading(true); setDraft(null)
    try { setDraft(await generateDraft(type, { ...form, jurisdiction })) } catch { setError('Draft generation failed. Try again.') }
    setLoading(false)
  }
  return (
    <div className="page">
      <h1>Draft Document</h1>
      <div className="row">{TYPES.map((t) => <button key={t} className={t === type ? 'primary' : ''} onClick={() => { setType(t); setDraft(null) }}>{t}</button>)}</div>
      {type && (
        <div className="card">
          <p>Jurisdiction: {jurisdiction.state}, {jurisdiction.country}</p>
          {FIELDS.map(([k, label]) => (
            <div key={k}><label htmlFor={k}>{label}</label>
              {k === 'incident' || k === 'facts' ? <textarea id={k} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /> : <input id={k} type={k === 'date' ? 'date' : 'text'} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />}</div>
          ))}
          {error && <p className="badge high">{error}</p>}
          <br /><button className="primary" onClick={generate} disabled={loading}>Generate Draft</button> {loading && <LoadingIndicator />}
        </div>
      )}
      {draft && <><DraftEditor key={draft.id} draft={draft} onRegenerate={generate} /><VerificationPanel checks={draft.verification} /></>}
    </div>
  )
}
