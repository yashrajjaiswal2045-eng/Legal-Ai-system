import { useState } from 'react'
import { uploadDocument } from '../services/api'
const OK = /\.(pdf|docx|txt|png|jpe?g)$/i
export default function DocumentUpload({ onDone }) {
  const [files, setFiles] = useState([])
  const patch = (name, p) => setFiles((fs) => fs.map((f) => (f.name === name ? { ...f, ...p } : f)))
  const add = async (list) => {
    for (const file of list) {
      const entry = { name: file.name, size: file.size, progress: 0, state: OK.test(file.name) ? 'uploading' : 'error' }
      setFiles((fs) => [...fs, entry])
      if (entry.state === 'error') continue
      const t = setInterval(() => setFiles((fs) => fs.map((f) => (f.name === file.name && f.progress < 90 ? { ...f, progress: f.progress + 15 } : f))), 150)
      try { await uploadDocument(file); patch(file.name, { progress: 100, state: 'done' }); onDone?.(file) }
      catch { patch(file.name, { state: 'error' }) }
      clearInterval(t)
    }
  }
  return (
    <div>
      <div className="drop" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); add([...e.dataTransfer.files]) }}>
        <p>Drag files here or choose them. PDF, DOCX, TXT and images.</p>
        <input type="file" multiple accept=".pdf,.docx,.txt,image/*" onChange={(e) => add([...e.target.files])} />
      </div>
      {files.map((f) => (
        <div className="card" key={f.name}>
          <div className="row"><strong>{f.name}</strong><span className="meta">{(f.size / 1024).toFixed(1)} KB</span>
            <span>{{ uploading: 'Processing...', done: 'Uploaded', error: 'Error: unsupported file or upload failed' }[f.state]}</span>
            <button onClick={() => setFiles(files.filter((x) => x.name !== f.name))}>Remove</button></div>
          <div className="bar"><i style={{ width: f.progress + '%' }} /></div>
        </div>
      ))}
    </div>
  )
}
