import RiskBadge from './RiskBadge'
import CitationCard from './CitationCard'
import VerificationPanel from './VerificationPanel'
export default function MessageBubble({ m, onRegenerate, onReview, onDraft }) {
  const time = new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (m.role === 'user') return <div className="msg user">{m.text}<div className="meta">{time}</div></div>
  return (
    <div className="msg">
      <RiskBadge level={m.risk} />
      <p>{m.text}</p>
      <div className="meta">{time}. This answer is informational.</div>
      {m.risk === 'high' && (
        <div className="warn"><strong>This matter may require professional legal review.</strong>
          <div><button className="primary" onClick={onReview}>Request Human Review</button></div></div>
      )}
      {m.sources.map((s) => <CitationCard key={s.id} source={s} />)}
      <VerificationPanel checks={m.verification} />
      <div className="row">
        <button onClick={() => navigator.clipboard?.writeText(m.text)}>Copy</button>
        <button onClick={onRegenerate}>Regenerate</button>
        <button aria-label="Helpful">👍</button><button aria-label="Not helpful">👎</button>
        <button onClick={onDraft}>Draft a document</button>
      </div>
    </div>
  )
}
