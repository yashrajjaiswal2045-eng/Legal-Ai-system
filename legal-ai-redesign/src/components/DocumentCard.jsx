import Icon from './ui/Icon'
import Badge from './ui/Badge'
import Button from './ui/Button'
import { formatDate, formatSize } from '../utils'

const STATUS_VARIANT = { Uploaded: 'green', Generated: 'blue', Downloaded: 'green', 'Demo only': 'amber', 'Demo copy': 'amber' }
// One row in the document library. "Remove" only removes it from this list (nothing is deleted on the server).
export default function DocumentCard({ doc, onRemove }) {
  return (
    <li className="doc-row">
      <span className="doc-icon"><Icon name={doc.type === 'Draft' ? 'pen' : 'fileText'} size={18} /></span>
      <div className="doc-main">
        <strong title={doc.name}>{doc.name}</strong>
        <span className="doc-meta">{[doc.type, doc.size ? formatSize(doc.size) : null, formatDate(doc.date)].filter(Boolean).join(' · ')}</span>
      </div>
      <Badge variant={STATUS_VARIANT[doc.status] || 'neutral'}>{doc.status}</Badge>
      {doc.demo && <Badge title="Backend was not reached">Not stored</Badge>}
      {onRemove && <Button variant="ghost" size="sm" iconOnly icon="trash" aria-label={`Remove ${doc.name} from this list`} title="Remove from this list" onClick={onRemove} />}
    </li>
  )
}
