import { useState } from 'react'
const PROMPTS = ['My landlord has not returned my security deposit.', 'Help me draft a consumer complaint.', 'I need an RTI application draft.', 'Help me understand this employment agreement.']
export default function ChatInput({ onSend, disabled, onAttach }) {
  const [text, setText] = useState('')
  const send = (t) => { if (t.trim()) { onSend(t.trim()); setText('') } }
  return (
    <div>
      <div className="row">{PROMPTS.map((p) => <button key={p} onClick={() => send(p)} disabled={disabled}>{p}</button>)}</div>
      <textarea rows="3" placeholder="Describe your legal problem..." value={text} onChange={(e) => setText(e.target.value)} />
      <div className="row">
        <button onClick={onAttach}>Attach document</button>
        <button onClick={() => alert('Voice input coming later')} aria-label="Microphone">🎤</button>
        <button className="primary" disabled={disabled} onClick={() => send(text)}>Send</button>
      </div>
    </div>
  )
}
