import { useState } from 'react'
import { askQuestion, submitForReview } from '../services/api'
import ChatWindow from '../components/ChatWindow'
import ChatInput from '../components/ChatInput'
import Disclaimer from '../components/Disclaimer'
export default function Consultation({ jurisdiction, go }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const ask = async (text) => {
    setError(''); setLoading(true)
    setMessages((m) => [...m, { role: 'user', text, time: Date.now() }])
    try {
      const r = await askQuestion(text, jurisdiction)
      setMessages((m) => [...m, { role: 'ai', text: r.answer, risk: r.risk, sources: r.sources, verification: r.verification, time: Date.now() }])
    } catch { setError('Could not get an answer. Please try again.') }
    setLoading(false)
  }
  const lastQuestion = () => [...messages].reverse().find((m) => m.role === 'user')?.text
  return (
    <div className="page">
      <p className="card">Jurisdiction: <strong>{jurisdiction.state}, {jurisdiction.country}</strong>. Domain: <strong>{jurisdiction.domain}</strong></p>
      <ChatWindow messages={messages} loading={loading} onRegenerate={() => lastQuestion() && ask(lastQuestion())}
        onReview={async () => { await submitForReview({ question: lastQuestion() }); setNotice('Sent for human review. Status: Pending.') }} onDraft={() => go('drafts')} />
      {error && <p className="badge high">{error}</p>}{notice && <p className="badge low">{notice}</p>}
      <ChatInput onSend={ask} disabled={loading} onAttach={() => go('documents')} />
      <Disclaimer />
    </div>
  )
}
