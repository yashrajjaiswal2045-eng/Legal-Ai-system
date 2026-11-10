import { useEffect, useRef } from 'react'
import { PROMPTS } from '../constants'
import Icon from './ui/Icon'
import LoadingIndicator from './LoadingIndicator'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ messages, loading, reviews, onPrompt, onRegenerate, onReview, onDraft }) {
  const end = useRef(null)
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [messages.length, loading])
  return (
    <div className="chat-scroll" aria-live="polite" aria-label="Conversation">
      {messages.length === 0 && (
        <div className="intro">
          <span className="logo-mark" aria-hidden="true">§</span>
          <h2>How can Legal.AI help today?</h2>
          <p>Describe your situation in plain language. The jurisdiction selected above is used to tailor general information. Try one of these to get started.</p>
          <div className="prompt-grid">
            {PROMPTS.map((p) => (
              <button type="button" key={p} className="prompt-card" onClick={() => onPrompt(p)} disabled={loading}>
                <span>{p}</span><Icon name="arrowRight" size={16} />
              </button>
            ))}
          </div>
        </div>
      )}
      {messages.map((m, i) => (
        <MessageBubble key={i} m={m} review={reviews[i]} onRegenerate={() => onRegenerate(i)} onReview={() => onReview(i)} onDraft={onDraft} />
      ))}
      {loading && (
        <div className="msg msg-ai">
          <div className="avatar-ai" aria-hidden="true">§</div>
          <div className="ai-card" style={{ padding: '14px 18px' }}><LoadingIndicator label="Legal.AI is preparing an answer" /></div>
        </div>
      )}
      <div ref={end} />
    </div>
  )
}
