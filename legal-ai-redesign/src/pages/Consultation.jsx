import { useState } from 'react'
import { askQuestion, submitForReview } from '../services/api'
import ChatWindow from '../components/ChatWindow'
import ChatInput from '../components/ChatInput'
import Disclaimer from '../components/Disclaimer'
import JurisdictionSelector from '../components/JurisdictionSelector'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'

export default function Consultation({ jurisdiction, setJurisdiction, messages, setMessages, go }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null) // { retry }
  const [reviews, setReviews] = useState({}) // review-request state per message index

  // replaceIndex: when set, the answer at that index is replaced (regenerate) instead of appending.
  const ask = async (text, replaceIndex = null) => {
    setError(null); setLoading(true)
    if (replaceIndex === null) setMessages((m) => [...m, { role: 'user', text, time: Date.now() }])
    try {
      const r = await askQuestion(text, jurisdiction)
      const ai = { role: 'ai', text: r.answer, risk: r.risk, sources: r.sources || [], verification: r.verification || {}, demo: !!r.demo, time: Date.now() }
      setMessages((m) => (replaceIndex === null ? [...m, ai] : m.map((x, i) => (i === replaceIndex ? ai : x))))
    } catch {
      setError({ retry: () => ask(text, replaceIndex) })
    }
    setLoading(false)
  }
  const regenerate = (i) => { const q = messages[i - 1]; if (q) ask(q.text, i) }
  const requestReview = async (i) => {
    setReviews((r) => ({ ...r, [i]: { state: 'sending' } }))
    try {
      const res = await submitForReview({ question: messages[i - 1]?.text })
      setReviews((r) => ({ ...r, [i]: res.demo ? { state: 'demo' } : { state: 'sent', status: res.status } }))
    } catch {
      setReviews((r) => ({ ...r, [i]: { state: 'error' } }))
    }
  }
  const reset = () => { setMessages([]); setReviews({}); setError(null) }

  return (
    <div className="page page-chat">
      <div className="card chat-head">
        <JurisdictionSelector value={jurisdiction} onChange={setJurisdiction} idPrefix="chat" />
        <Button icon="plus" onClick={reset} disabled={loading || messages.length === 0}>New consultation</Button>
      </div>
      <ChatWindow messages={messages} loading={loading} reviews={reviews} onPrompt={ask} onRegenerate={regenerate} onReview={requestReview} onDraft={() => go('drafts')} />
      {error && (
        <Alert variant="error" title="We could not get an answer" action={<Button size="sm" icon="refresh" onClick={error.retry}>Retry</Button>}>
          Something went wrong while contacting the service.
        </Alert>
      )}
      <ChatInput onSend={ask} disabled={loading} onAttach={() => go('documents')} />
      <div className="chat-foot"><Disclaimer /></div>
    </div>
  )
}
