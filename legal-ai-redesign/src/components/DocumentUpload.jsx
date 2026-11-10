import { useRef, useState } from 'react'
import { uploadDocument } from '../services/api'
import Icon from './ui/Icon'
import Badge from './ui/Badge'
import Button from './ui/Button'
import Alert from './ui/Alert'
import { formatSize, today } from '../utils'

// Limits mirror the backend: PDF, DOCX and TXT, up to 10 MB.
const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED = ['pdf', 'docx', 'txt']
const extOf = (name) => name.split('.').pop().toLowerCase()

export default function DocumentUpload({ onUploaded }) {
  const [queue, setQueue] = useState([]) // files that are uploading or failed
  const [over, setOver] = useState(false)
  const input = useRef(null)
  const patch = (key, p) => setQueue((q) => q.map((x) => (x.key === key ? { ...x, ...p } : x)))

  const run = async (entry) => {
    patch(entry.key, { state: 'uploading', message: '' })
    try {
      const res = await uploadDocument(entry.file)
      onUploaded?.({ id: `${res.id}-${entry.key}`, name: entry.file.name, size: entry.file.size, type: extOf(entry.file.name).toUpperCase(), date: today(), status: res.demo ? 'Demo only' : 'Uploaded', demo: !!res.demo })
      setQueue((q) => q.filter((x) => x.key !== entry.key))
    } catch {
      patch(entry.key, { state: 'error', retry: true, message: 'Upload failed. Check your connection and try again.' })
    }
  }
  const add = (files) => {
    ;[...files].forEach((file, i) => {
      const key = `${Date.now()}-${i}`
      let problem = ''
      if (!ALLOWED.includes(extOf(file.name))) problem = 'Unsupported file type. Use PDF, DOCX or TXT.'
      else if (file.size > MAX_BYTES) problem = 'File is larger than 10 MB.'
      else if (file.size === 0) problem = 'The file is empty.'
      const entry = { key, file, state: problem ? 'error' : 'uploading', message: problem, retry: false }
      setQueue((q) => [...q, entry])
      if (!problem) run(entry)
    })
    if (input.current) input.current.value = ''
  }

  return (
    <div>
      <div className={`dropzone ${over ? 'over' : ''}`} onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files) }}>
        <div className="empty-icon"><Icon name="upload" size={22} /></div>
        <h3>Drag and drop files here</h3>
        <p className="muted">or choose files from your computer</p>
        <div style={{ marginTop: 14 }}>
          <input ref={input} id="file-input" type="file" multiple accept=".pdf,.docx,.txt" className="sr-only" tabIndex={-1} onChange={(e) => add(e.target.files)} />
          <Button variant="primary" icon="upload" onClick={() => input.current?.click()}>Choose files</Button>
        </div>
        <div className="dz-rules"><Badge>PDF</Badge><Badge>DOCX</Badge><Badge>TXT</Badge><Badge icon="info">Max 10 MB each</Badge></div>
      </div>

      {queue.length > 0 && (
        <ul className="doc-list" style={{ marginTop: 14 }} aria-live="polite">
          {queue.map((f) => (
            <li className="doc-row" key={f.key} style={{ flexWrap: 'wrap' }}>
              <span className="doc-icon"><Icon name="fileText" size={18} /></span>
              <div className="doc-main">
                <strong>{f.file.name}</strong>
                <span className="doc-meta">{formatSize(f.file.size)} · {f.state === 'uploading' ? 'Uploading...' : 'Not uploaded'}</span>
                {f.state === 'uploading' && <div className="bar" role="progressbar" aria-label={`Uploading ${f.file.name}`}><i /></div>}
              </div>
              {f.retry && <Button size="sm" icon="refresh" onClick={() => run(f)}>Retry</Button>}
              {f.state === 'error' && <Button size="sm" variant="ghost" iconOnly icon="x" aria-label={`Dismiss ${f.file.name}`} onClick={() => setQueue((q) => q.filter((x) => x.key !== f.key))} />}
              {f.state === 'error' && <div style={{ flexBasis: '100%' }}><Alert variant="error">{f.message}</Alert></div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
