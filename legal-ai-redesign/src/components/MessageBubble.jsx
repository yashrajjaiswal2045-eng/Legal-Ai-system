import { useEffect, useRef, useState } from 'react'
import Icon from './ui/Icon'
import Badge from './ui/Badge'
import Button from './ui/Button'
import Alert from './ui/Alert'
import RiskBadge from './RiskBadge'
import CitationCard from './CitationCard'
import VerificationPanel from './VerificationPanel'
import LoadingIndicator from './LoadingIndicator'
import { formatTime } from '../utils'

function Disclosure({ icon, title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="disclosure">
      <button type="button" className="disclosure-btn" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Icon name={icon} size={16} />{title}<Icon name="chevronDown" size={16} className="chev" />
      </button>
      {open && <div className="disclosure-body">{children}</div>}
    </div>
  )
}

export default function MessageBubble({ m, onRegenerate, onReview, onDraft, review = { state: 'idle' } }) {
  const [copied, setCopied] = useState(false)
  const [vote, setVote] = useState(null)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  if (m.role === 'user') {
    return <div className="msg msg-user"><div className="bubble">{m.text}<time>{formatTime(m.time)}</time></div></div>
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(m.text); setCopied(true); timer.current = setTimeout(() => setCopied(false), 1600) } catch { /* clipboard blocked */ }
  }
  const checks = Object.values(m.verification || {}).filter(Boolean).length
  return (
    <div className="msg msg-ai">
      <div className="avatar-ai" aria-hidden="true">§</div>
      <div className="ai-card">
        <div className="ai-head">
          <span className="ai-name">Legal.AI</span>
          <RiskBadge level={m.risk} />
          <Badge icon="info">Informational</Badge>
          {m.demo && <Badge variant="blue">Sample answer: backend not reached</Badge>}
        </div>
        <p className="ai-text">{m.text}</p>

        {m.risk === 'high' && (
          <div className="risk-banner" role="alert">
            <Icon name="alert" size={20} />
            <div>
              <strong>This matter may require professional legal review.</strong>
              Legal.AI cannot give definitive advice on matters like this. Please speak to a qualified lawyer, and request a human review if you would like one.
              {review.state === 'idle' || review.state === 'sending' || review.state === 'error' ? (
                <div><Button variant="danger-solid" size="sm" icon="userCheck" loading={review.state === 'sending'} onClick={onReview}>Request Human Review</Button></div>
              ) : null}
              {review.state === 'sent' && <div style={{ marginTop: 10 }}><Alert variant="success" title="Review requested">The server confirmed your request. Status: {review.status}.</Alert></div>}
              {review.state === 'demo' && <div style={{ marginTop: 10 }}><Alert variant="warning" title="Demo mode">The backend could not be reached, so nothing was sent for review.</Alert></div>}
              {review.state === 'error' && <div style={{ marginTop: 10 }}><Alert variant="error" title="Request failed">Please try again.</Alert></div>}
            </div>
          </div>
        )}

        <Disclosure icon="book" title={`Sources (${(m.sources || []).length})`}>
          {(m.sources || []).length === 0 ? (
            <p className="small muted" style={{ marginTop: 8 }}>No sources were retrieved for this answer. Source retrieval is not available yet, so please verify this information independently.</p>
          ) : (
            m.sources.map((s) => <CitationCard key={s.id} source={s} demo={m.demo} />)
          )}
        </Disclosure>
        <Disclosure icon="shieldCheck" title={`Verification: ${checks} of 5 checks completed`}>
          <div style={{ marginTop: 8 }}><VerificationPanel checks={m.verification} demo={m.demo} /></div>
        </Disclosure>

        <div className="ai-actions">
          <Button variant="ghost" size="sm" icon={copied ? 'check' : 'copy'} onClick={copy}>{copied ? 'Copied' : 'Copy'}</Button>
          <Button variant="ghost" size="sm" icon="refresh" onClick={onRegenerate}>Regenerate</Button>
          <Button variant="ghost" size="sm" iconOnly icon="thumbUp" aria-label="Mark as helpful" aria-pressed={vote === 'up'} style={vote === 'up' ? { color: 'var(--green-600)' } : undefined} onClick={() => setVote(vote === 'up' ? null : 'up')} />
          <Button variant="ghost" size="sm" iconOnly icon="thumbDown" aria-label="Mark as not helpful" aria-pressed={vote === 'down'} style={vote === 'down' ? { color: 'var(--red-600)' } : undefined} onClick={() => setVote(vote === 'down' ? null : 'down')} />
          <span className="spacer" />
          <Button variant="ghost" size="sm" icon="pen" onClick={onDraft}>Draft a document</Button>
        </div>
        <p className="ai-meta">{formatTime(m.time)}. This answer is informational and may be wrong.</p>
      </div>
    </div>
  )
}
