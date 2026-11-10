import { useEffect, useState } from 'react'
import { getConversations } from '../services/api'
import RiskBadge from '../components/RiskBadge'
import LoadingIndicator from '../components/LoadingIndicator'
import Icon from '../components/ui/Icon'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { TextField } from '../components/ui/Field'
import { formatDate } from '../utils'

const QUICK = [
  ['consultation', 'message', 'Start a consultation', 'Ask a legal question in plain language.'],
  ['drafts', 'pen', 'Draft a document', 'Generate a complaint, notice or letter.'],
  ['documents', 'upload', 'Upload a document', 'Add a PDF, DOCX or TXT file.'],
  ['review', 'userCheck', 'Review queue', 'See cases waiting for human review.'],
]

export default function Dashboard({ go, messages, library }) {
  const [items, setItems] = useState(null)
  const [demo, setDemo] = useState(false)
  const [renaming, setRenaming] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [title, setTitle] = useState('')
  useEffect(() => { getConversations().then((r) => { setDemo(!!r.demo); setItems([...r]) }).catch(() => setItems([])) }, [])

  const asked = messages.filter((m) => m.role === 'user')
  const stats = [['Questions asked', asked.length], ['Drafts generated', library.drafts.length], ['Documents uploaded', library.uploads.length]]

  return (
    <div className="page">
      <div className="page-head">
        <h1>Welcome to Legal.AI</h1>
        <p>Start a consultation, draft a document, or check the review queue. Informational guidance only, not legal representation.</p>
      </div>

      <div className="quick-grid">
        {QUICK.map(([page, icon, name, desc]) => (
          <button type="button" key={page} className="quick" onClick={() => go(page)}>
            <span className="type-ico"><Icon name={icon} size={18} /></span>
            <span><strong>{name}</strong><span className="desc">{desc}</span></span>
          </button>
        ))}
      </div>

      <div className="card card-pad" style={{ marginBottom: 24 }}>
        <div className="card-head"><h2>This session</h2><span className="muted small">Counts from your current browser session</span></div>
        <div className="summary-grid" style={{ marginBottom: 0 }}>
          {stats.map(([label, n]) => <div className="card stat" key={label}><strong>{n}</strong><span>{label}</span></div>)}
        </div>
        {asked.length > 0 && (
          <div className="row" style={{ marginTop: 14 }}>
            <Icon name="message" size={16} /><span className="small">Current consultation: {asked[0].text.slice(0, 80)}{asked[0].text.length > 80 ? '...' : ''}</span>
            <Button size="sm" onClick={() => go('consultation')}>Continue</Button>
          </div>
        )}
      </div>

      <div className="card-head"><h2 style={{ fontSize: 16 }}>Conversation history</h2></div>
      {items === null ? (
        <div className="card card-pad"><LoadingIndicator label="Loading conversations" /></div>
      ) : (
        <div className="stack">
          {demo && <Alert variant="info" title="Sample data">Conversation history is not stored by the backend yet. The conversations below are examples for illustration.</Alert>}
          {items.length === 0 ? (
            <div className="card"><EmptyState icon="message" title="No conversations yet" action={<Button variant="primary" onClick={() => go('consultation')}>Start a consultation</Button>}>Your past consultations will be listed here.</EmptyState></div>
          ) : (
            <ul className="doc-list">
              {items.map((c) => (
                <li className="doc-row" key={c.id} style={{ flexWrap: 'wrap' }}>
                  <span className="doc-icon"><Icon name="message" size={18} /></span>
                  <div className="doc-main">
                    <strong>{c.title}</strong>
                    <span className="doc-meta">{formatDate(c.date)} · {c.jurisdiction} · {c.category}</span>
                  </div>
                  <RiskBadge level={c.risk} />
                  <Badge>{c.status}</Badge>
                  {demo && <Badge variant="blue">Sample</Badge>}
                  <Button size="sm" onClick={() => go('consultation')}>Open</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setRenaming(c); setTitle(c.title) }}>Rename</Button>
                  <Button size="sm" variant="ghost" iconOnly icon="trash" aria-label={`Delete ${c.title}`} onClick={() => setDeleting(c)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Modal open={!!renaming} title="Rename conversation" onClose={() => setRenaming(null)}
        footer={<><Button onClick={() => setRenaming(null)}>Cancel</Button><Button variant="primary" disabled={!title.trim()} onClick={() => { setItems(items.map((x) => (x.id === renaming.id ? { ...x, title: title.trim() } : x))); setRenaming(null) }}>Save</Button></>}>
        <TextField id="rename" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Modal>
      <Modal open={!!deleting} title="Delete this conversation?" onClose={() => setDeleting(null)}
        footer={<><Button onClick={() => setDeleting(null)}>Cancel</Button><Button variant="danger-solid" onClick={() => { setItems(items.filter((x) => x.id !== deleting.id)); setDeleting(null) }}>Delete</Button></>}>
        <p>"{deleting?.title}" will be removed from this list. This only affects the list shown here.</p>
      </Modal>
    </div>
  )
}
