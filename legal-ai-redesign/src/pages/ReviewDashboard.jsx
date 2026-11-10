import { useEffect, useState } from 'react'
import { getReviewStatus, submitReviewAction } from '../services/api'
import ReviewCard, { STATUS_VARIANT } from '../components/ReviewCard'
import CitationCard from '../components/CitationCard'
import RiskBadge from '../components/RiskBadge'
import LoadingIndicator from '../components/LoadingIndicator'
import Icon from '../components/ui/Icon'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { formatDate } from '../utils'

const ACTIONS = {
  approve: { status: 'Approved', title: 'Approve this case?', text: 'The approval will be sent to the server.', button: 'Approve', variant: 'primary' },
  reject: { status: 'Rejected', title: 'Reject this case?', text: 'The rejection will be sent to the server.', button: 'Reject', variant: 'danger-solid' },
  escalate: { status: 'Escalated', title: 'Escalate this case?', text: 'The case will be marked for escalation on the server.', button: 'Escalate', variant: 'primary' },
}
const CHECKLIST = ['Citations checked', 'Dates checked', 'Names checked', 'Required fields checked', 'Document consistency checked']

export default function ReviewDashboard() {
  const [cases, setCases] = useState(null)
  const [demo, setDemo] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [confirm, setConfirm] = useState(null) // 'approve' | 'reject' | 'escalate'
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [ticks, setTicks] = useState({}) // local reviewer checklist (never sent anywhere)

  const load = () => {
    setLoadError(false); setCases(null)
    getReviewStatus().then((r) => { setDemo(!!r.demo); setCases([...r]) }).catch(() => setLoadError(true))
  }
  useEffect(load, [])

  const selected = cases?.find((c) => c.id === selectedId)
  const open = (c) => { setSelectedId(c.id); setResult(null); setEditing(false); setTicks({}) }

  const perform = async (action) => {
    setBusy(true)
    try {
      const res = await submitReviewAction(selected.id, action, action === 'edit' ? editText : undefined)
      const status = action === 'edit' ? 'Edited' : ACTIONS[action].status
      setCases((cs) => cs.map((c) => (c.id === selected.id ? { ...c, status, unsaved: !!res.demo, ...(action === 'edit' ? { draft: editText } : {}) } : c)))
      setResult(res.demo
        ? { variant: 'warning', title: 'Not saved', text: 'The backend could not be reached, so this change is shown here only and was not saved.' }
        : { variant: 'success', title: `Saved: ${status}`, text: res.message || 'The server confirmed the change.' })
      if (action === 'edit') setEditing(false)
    } catch {
      setResult({ variant: 'error', title: 'Could not complete the action', text: 'Please try again.' })
    }
    setBusy(false); setConfirm(null)
  }

  if (loadError) return <div className="page"><Alert variant="error" title="Could not load review cases" action={<Button size="sm" icon="refresh" onClick={load}>Retry</Button>}>Please check that the backend is running.</Alert></div>
  if (!cases) return <div className="page"><LoadingIndicator label="Loading review cases" /></div>

  if (selected) {
    const c = selected
    return (
      <div className="page">
        <Button variant="ghost" icon="chevronLeft" onClick={() => setSelectedId(null)} style={{ marginBottom: 12 }}>Back to review queue</Button>
        <div className="page-head">
          <h1>{c.title}</h1>
          <div className="row" style={{ marginTop: 8 }}>
            <RiskBadge level={c.risk} />
            <Badge variant={STATUS_VARIANT[c.status] || 'neutral'}>{c.status}</Badge>
            {c.unsaved && <Badge>Not saved</Badge>}
            <span className="muted small">{c.jurisdiction}{c.date ? ` · ${formatDate(c.date)}` : ''}</span>
          </div>
        </div>
        {demo && <div style={{ marginBottom: 16 }}><Alert variant="info" title="Sample case">The backend could not be reached. This case is example data.</Alert></div>}
        {result && <div style={{ marginBottom: 16 }} aria-live="polite"><Alert variant={result.variant} title={result.title} onDismiss={() => setResult(null)}>{result.text}</Alert></div>}

        <div className="detail-grid">
          <div className="stack">
            <div className="card card-pad detail-block"><h3>User's original question</h3><p>{c.question || 'Not provided.'}</p></div>
            <div className="card card-pad detail-block">
              <h3>Extracted facts</h3>
              {c.facts?.length ? <ul className="fact-list">{c.facts.map((f) => <li key={f}>{f}</li>)}</ul> : <p className="muted">No facts were extracted for this case.</p>}
            </div>
            <div className="card card-pad detail-block"><h3>AI reasoning summary</h3><p>{c.reasoning || 'Not provided.'}</p></div>
            <div className="card card-pad detail-block">
              <div className="card-head" style={{ marginBottom: 8 }}>
                <h3 style={{ margin: 0 }}>Draft document</h3>
                {!editing && <Button size="sm" icon="pen" onClick={() => { setEditText(c.draft || ''); setEditing(true) }}>Edit</Button>}
              </div>
              {editing ? (
                <div className="stack">
                  <label htmlFor="review-edit" className="sr-only">Edit draft</label>
                  <textarea id="review-edit" className="textarea" style={{ minHeight: 220, fontFamily: 'var(--font-serif)', fontSize: 15 }} value={editText} onChange={(e) => setEditText(e.target.value)} />
                  <div className="row"><Button variant="primary" loading={busy} disabled={!editText.trim()} onClick={() => perform('edit')}>Save changes</Button><Button onClick={() => setEditing(false)}>Cancel</Button></div>
                </div>
              ) : c.draft ? <pre>{c.draft}</pre> : <p className="muted">No draft is attached to this case.</p>}
            </div>
          </div>

          <div className="stack">
            <div className="card card-pad">
              <div className="card-head"><h3>Decision</h3></div>
              <div className="action-stack">
                <Button variant="primary" icon="check" onClick={() => setConfirm('approve')}>Approve</Button>
                <Button icon="pen" onClick={() => { setEditText(c.draft || ''); setEditing(true) }}>Edit draft</Button>
                <Button variant="danger" icon="x" onClick={() => setConfirm('reject')}>Reject</Button>
                <Button icon="arrowRight" onClick={() => setConfirm('escalate')}>Escalate</Button>
              </div>
            </div>
            <div className="card card-pad">
              <div className="card-head"><h3>Sources and citations</h3></div>
              {c.sources?.length ? c.sources.map((s) => <CitationCard key={s.id} source={s} demo={demo} />) : <p className="muted small">No sources are attached to this case.</p>}
            </div>
            <div className="card card-pad">
              <div className="card-head"><h3>Verification status</h3></div>
              <p className="muted small" style={{ marginBottom: 8 }}>Automated verification results are not included with review cases yet. Use this checklist while you review. It is for your own use and is not saved.</p>
              {CHECKLIST.map((label, i) => (
                <label className="check-row" key={label}>
                  <input type="checkbox" checked={!!ticks[i]} onChange={() => setTicks({ ...ticks, [i]: !ticks[i] })} />{label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <Modal open={!!confirm} title={confirm ? ACTIONS[confirm].title : ''} onClose={() => !busy && setConfirm(null)}
          footer={<><Button onClick={() => setConfirm(null)} disabled={busy}>Cancel</Button><Button variant={confirm ? ACTIONS[confirm].variant : 'primary'} loading={busy} onClick={() => perform(confirm)}>{confirm ? ACTIONS[confirm].button : ''}</Button></>}>
          <p>{confirm && ACTIONS[confirm].text}</p>
        </Modal>
      </div>
    )
  }

  const pending = cases.filter((c) => c.status === 'Pending').length
  return (
    <div className="page">
      <div className="page-head"><h1>Review</h1><p>Cases flagged for human review. Open a case to inspect the question, sources and draft, then record a decision.</p></div>
      {demo && <div style={{ marginBottom: 16 }}><Alert variant="info" title="Sample data">The backend could not be reached, so example cases are shown.</Alert></div>}
      <div className="summary-grid">
        <div className="card stat"><strong>{pending}</strong><span>Pending review</span></div>
        <div className="card stat"><strong>{cases.length}</strong><span>Total cases</span></div>
      </div>
      {cases.length === 0 ? (
        <div className="card"><EmptyState icon="userCheck" title="No cases are waiting for review">High-risk questions and drafts that are sent for review will appear here.</EmptyState></div>
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead><tr><th scope="col">Case</th><th scope="col">Risk</th><th scope="col">Jurisdiction</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{cases.map((c) => <ReviewCard key={c.id} item={c} onOpen={() => open(c)} />)}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
