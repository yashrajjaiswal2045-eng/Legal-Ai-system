import { useState } from 'react'
import DocumentUpload from '../components/DocumentUpload'
import DocumentCard from '../components/DocumentCard'
import Tabs from '../components/ui/Tabs'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'

const EMPTY = {
  uploads: ['folder', 'No uploaded documents yet', 'Files you upload in this session will appear here.'],
  drafts: ['pen', 'No drafts generated yet', 'Documents you generate on the Draft Document page will appear here.'],
  downloads: ['download', 'Nothing downloaded yet', 'Files you download from a draft will be listed here.'],
}
export default function Documents({ library, addToLibrary, removeFromLibrary, go }) {
  const [tab, setTab] = useState('uploads')
  const items = library[tab]
  const [icon, title, text] = EMPTY[tab]
  return (
    <div className="page">
      <div className="page-head">
        <h1>Documents</h1>
        <p>Upload documents for reference and keep track of the drafts you generate and download.</p>
      </div>
      <div className="stack">
        <Alert variant="info">This library lists items from your current browser session. It is not loaded from the server.</Alert>
        <Tabs label="Document categories" value={tab} onChange={setTab} tabs={[
          { id: 'uploads', label: 'Uploaded documents', count: library.uploads.length },
          { id: 'drafts', label: 'Generated drafts', count: library.drafts.length },
          { id: 'downloads', label: 'Downloaded documents', count: library.downloads.length },
        ]} />
        <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="stack">
          {tab === 'uploads' && <DocumentUpload onUploaded={(d) => addToLibrary('uploads', d)} />}
          {items.length === 0 ? (
            <div className="card"><EmptyState icon={icon} title={title} action={tab === 'drafts' ? <Button variant="primary" icon="pen" onClick={() => go('drafts')}>Draft a document</Button> : null}>{text}</EmptyState></div>
          ) : (
            <ul className="doc-list">{items.map((d) => <DocumentCard key={d.id} doc={d} onRemove={() => removeFromLibrary(tab, d.id)} />)}</ul>
          )}
        </div>
      </div>
    </div>
  )
}
