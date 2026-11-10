import { useState } from 'react'
import { generateDraft } from '../services/api'
import { DOC_TYPES } from '../constants'
import { today } from '../utils'
import DraftEditor from '../components/DraftEditor'
import VerificationPanel from '../components/VerificationPanel'
import JurisdictionSelector from '../components/JurisdictionSelector'
import RiskBadge from '../components/RiskBadge'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'
import { TextField, TextAreaField } from '../components/ui/Field'

export default function Drafts({ jurisdiction, setJurisdiction, addToLibrary }) {
  const [type, setType] = useState('')
  const [form, setForm] = useState({ name: '', address: '', opposite: '', date: '', amount: '', incident: '', facts: '' })
  const [errors, setErrors] = useState({})
  const [draft, setDraft] = useState(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setErrors({ ...errors, [k]: '' }) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Enter your full name.'
    if (!form.incident.trim()) e.incident = 'Describe what happened.'
    else if (form.incident.trim().length < 15) e.incident = 'Add a little more detail (at least a sentence).'
    if (form.amount && !/\d/.test(form.amount)) e.amount = 'Enter the amount as a number.'
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const generate = async () => {
    if (!validate()) return
    setLoading(true); setFailed(false)
    try {
      const d = await generateDraft(type, { ...form, jurisdiction })
      setDraft(d)
      addToLibrary('drafts', { id: d.id, name: type, type: 'Draft', date: today(), status: 'Generated', demo: !!d.demo })
    } catch {
      setFailed(true)
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Draft Document</h1>
        <p>Choose a document type, add the facts, and generate an editable first draft. Always check the draft before you use it.</p>
      </div>
      <div className="draft-grid">
        <div className="stack">
          <section className="card card-pad" aria-labelledby="s1">
            <div className="step"><span className="step-n">1</span><h2 id="s1">Choose a document type</h2></div>
            <div className="type-grid" role="radiogroup" aria-labelledby="s1">
              {DOC_TYPES.map((t) => (
                <label className="type-card" key={t.name}>
                  <input type="radio" name="doc-type" className="sr-only" checked={type === t.name} onChange={() => { setType(t.name); setDraft(null) }} />
                  <span className="type-card-body">
                    <span className="type-ico"><Icon name={t.icon} size={17} /></span>
                    <span><strong>{t.name}</strong><span className="desc">{t.desc}</span></span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="card card-pad" aria-labelledby="s2">
            <div className="step"><span className="step-n">2</span><h2 id="s2">Add the details</h2></div>
            {!type ? (
              <p className="muted">Select a document type above to continue.</p>
            ) : (
              <div className="stack">
                <div className="form-grid">
                  <JurisdictionSelector value={jurisdiction} onChange={setJurisdiction} idPrefix="draft" />
                </div>
                <div className="form-grid">
                  <TextField id="d-name" label="Full name" required value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                  <TextField id="d-opposite" label="Opposite party" value={form.opposite} onChange={set('opposite')} hint="Person, company or authority" />
                  <div className="full"><TextField id="d-address" label="Address" value={form.address} onChange={set('address')} autoComplete="street-address" /></div>
                  <TextField id="d-date" label="Date" type="date" value={form.date} onChange={set('date')} />
                  <TextField id="d-amount" label="Amount (Rs.)" inputMode="decimal" value={form.amount} onChange={set('amount')} error={errors.amount} hint="Optional" />
                  <div className="full"><TextAreaField id="d-incident" label="Incident description" required value={form.incident} onChange={set('incident')} error={errors.incident} hint="What happened, when, and what you want to happen next." /></div>
                  <div className="full"><TextAreaField id="d-facts" label="Additional facts" value={form.facts} onChange={set('facts')} hint="Optional: reference numbers, earlier messages, witnesses." /></div>
                </div>
                {failed && <Alert variant="error" title="Draft generation failed">Please try again.</Alert>}
                <div><Button variant="primary" icon="pen" loading={loading} onClick={generate}>Generate Draft</Button></div>
              </div>
            )}
          </section>
        </div>

        <section className="draft-side" aria-labelledby="s3" aria-live="polite">
          <div className="step"><span className="step-n">3</span><h2 id="s3">Review and download</h2></div>
          {loading && !draft ? (
            <div className="paper" style={{ padding: 28 }} role="status" aria-label="Generating draft">
              {[90, 100, 70, 100, 95, 60, 100, 80].map((w, i) => <div key={i} className="skeleton" style={{ width: `${w}%` }} />)}
            </div>
          ) : draft ? (
            <div className="stack">
              {draft.demo && <Alert variant="warning" title="Sample draft">The backend could not be reached, so this draft was built locally for demonstration.</Alert>}
              {draft.risk === 'high' && (
                <Alert variant="warning" title="This matter may require professional legal review">
                  <span className="row"><RiskBadge level="high" /> Please have a qualified lawyer check this draft before use. The server lists high-risk drafts in the review queue.</span>
                </Alert>
              )}
              <DraftEditor key={draft.id} draft={draft} regenerating={loading} onRegenerate={generate} onDownloaded={(d) => addToLibrary('downloads', d)} />
              <div className="card card-pad"><div className="card-head"><h3>Verification</h3></div><VerificationPanel checks={draft.verification} demo={draft.demo} /></div>
            </div>
          ) : (
            <div className="card"><EmptyState icon="fileText" title="Your draft will appear here">Pick a document type and fill in the details. The generated draft is editable and can be downloaded as DOCX or PDF.</EmptyState></div>
          )}
        </section>
      </div>
    </div>
  )
}
