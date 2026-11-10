import { useState } from 'react'
import { downloadDocx, downloadPdf } from '../services/api'
import Button from './ui/Button'
import Badge from './ui/Badge'
import Alert from './ui/Alert'
import { today } from '../utils'

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function DraftEditor({ draft, onRegenerate, regenerating, onDownloaded }) {
  const [text, setText] = useState(draft.text)
  const [editing, setEditing] = useState(false)
  const [kept, setKept] = useState(false)
  const [busy, setBusy] = useState(null) // 'docx' | 'pdf' | null
  const [status, setStatus] = useState(null) // { ok, kind, demo }

  const download = async (kind) => {
    setBusy(kind); setStatus(null)
    try {
      const blob = await (kind === 'docx' ? downloadDocx : downloadPdf)(draft.id, text)
      // If the backend was unreachable we only have plain text, so save it honestly as .txt.
      const ext = blob.demo ? 'txt' : kind
      const name = `${slug(draft.type)}.${ext}`
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob); a.download = name; a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
      setStatus({ ok: true, kind, demo: !!blob.demo, name })
      onDownloaded?.({ id: `${draft.id}-${kind}-${Date.now()}`, name, type: ext.toUpperCase(), date: today(), status: blob.demo ? 'Demo copy' : 'Downloaded', demo: !!blob.demo })
    } catch {
      setStatus({ ok: false, kind })
    }
    setBusy(null)
  }

  return (
    <div>
      <div className={`paper ${editing ? 'editing' : ''}`}>
        <div className="paper-bar">
          <strong style={{ marginRight: 4 }}>{draft.type}</strong>
          <Badge variant="amber">Draft</Badge>
          {editing && <Badge variant="blue">Editing</Badge>}
          <span className="spacer" />
          <Button size="sm" icon="pen" onClick={() => { setEditing(!editing); setKept(false) }}>{editing ? 'Done editing' : 'Edit'}</Button>
          <Button size="sm" icon="refresh" loading={regenerating} onClick={onRegenerate}>Regenerate</Button>
        </div>
        <label htmlFor="draft-text" className="sr-only">Draft document text</label>
        <textarea id="draft-text" className="paper-text" readOnly={!editing} value={text} onChange={(e) => { setText(e.target.value); setKept(false) }} />
        <div className="paper-foot">
          <Button size="sm" icon="check" onClick={() => setKept(true)}>Save draft</Button>
          <span className="small muted">{kept ? 'Edits kept in this session. They are sent to the server when you download.' : 'Edits are sent to the server when you download.'}</span>
          <span className="spacer" />
          <Button variant="primary" size="sm" icon="download" loading={busy === 'docx'} disabled={!!busy} onClick={() => download('docx')}>Download DOCX</Button>
          <Button variant="primary" size="sm" icon="download" loading={busy === 'pdf'} disabled={!!busy} onClick={() => download('pdf')}>Download PDF</Button>
        </div>
      </div>
      <div style={{ marginTop: 12 }} aria-live="polite">
        {status?.ok && !status.demo && <Alert variant="success" title={`${status.kind.toUpperCase()} downloaded`}>Saved as {status.name}.</Alert>}
        {status?.ok && status.demo && <Alert variant="warning" title="Demo copy saved">The backend could not be reached, so a plain-text copy ({status.name}) was saved instead of a real {status.kind.toUpperCase()} file.</Alert>}
        {status && !status.ok && <Alert variant="error" title="Download failed">Please try again.</Alert>}
      </div>
    </div>
  )
}
