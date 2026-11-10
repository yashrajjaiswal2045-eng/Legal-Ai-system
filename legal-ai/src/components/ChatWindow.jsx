import MessageBubble from './MessageBubble'
import LoadingIndicator from './LoadingIndicator'
export default function ChatWindow({ messages, loading, onRegenerate, onReview, onDraft }) {
  return (
    <div className="msgs">
      {messages.length === 0 && <p>Ask a question to begin. Your selected jurisdiction is shown above.</p>}
      {messages.map((m, i) => <MessageBubble key={i} m={m} onRegenerate={onRegenerate} onReview={onReview} onDraft={onDraft} />)}
      {loading && <div className="msg"><LoadingIndicator label="AI is typing" /></div>}
    </div>
  )
}
