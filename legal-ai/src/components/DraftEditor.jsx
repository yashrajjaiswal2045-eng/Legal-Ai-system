import { useState } from 'react'
import { downloadDocx, downloadPdf } from '../services/api'
function save(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click() }
export default function DraftEditor({ draft, onRegenerate }) {
  const [text, setText] = useState(draft.text)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  return (
    <div className="card">
      <h3>Draft preview</h3>
      <textarea className="doc" readOnly={!editing} value={text} onChange={(e) => { setText(e.target.value); setSaved(false) }} />
      <div className="row">
        <button onClick={() => setEditing(!editing)}>{editing ? 'Done editing' : 'Edit'}</button>
        <button onClick={onRegenerate}>Regenerate</button>
        <button onClick={() => setSaved(true)}>Save Draft</button>
        <button onClick={async () => save(await downloadDocx(draft.id, text), 'draft.docx')}>Download DOCX</button>
        <button onClick={async () => save(await downloadPdf(draft.id, text), 'draft.pdf')}>Download PDF</button>
        {saved && <span>Draft saved</span>}
      </div>
    </div>
  )
}
