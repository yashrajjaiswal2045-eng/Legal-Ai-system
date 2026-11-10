import { useEffect, useRef, useState } from 'react'
import Button from './ui/Button'
export default function ChatInput({ onSend, disabled, onAttach }) {
  const [text, setText] = useState('')
  const box = useRef(null)
  useEffect(() => { // grow with content, up to the CSS max-height
    if (!box.current) return
    box.current.style.height = 'auto'
    box.current.style.height = `${box.current.scrollHeight}px`
  }, [text])
  const send = () => {
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText('')
  }
  return (
    <div className="composer">
      <label htmlFor="chat-input" className="sr-only">Describe your legal question</label>
      <textarea
        id="chat-input" ref={box} rows={1} value={text} placeholder="Describe your situation in plain language..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
      />
      <div className="composer-bar">
        <Button variant="ghost" size="sm" icon="paperclip" onClick={onAttach}>Attach document</Button>
        <Button variant="ghost" size="sm" iconOnly icon="mic" aria-disabled="true" aria-label="Voice input (coming soon)" title="Voice input is coming soon" onClick={(e) => e.preventDefault()} />
        <span className="composer-hint">Enter to send, Shift+Enter for a new line</span>
        <span className="spacer" />
        <Button variant="primary" iconOnly icon="send" aria-label="Send message" disabled={!text.trim() || disabled} onClick={send} />
      </div>
    </div>
  )
}
