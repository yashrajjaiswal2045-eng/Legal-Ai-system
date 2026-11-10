import RiskBadge from './RiskBadge'
import Badge from './ui/Badge'
import Button from './ui/Button'
import { formatDate } from '../utils'

export const STATUS_VARIANT = { Pending: 'amber', Approved: 'green', Rejected: 'red', Escalated: 'blue', Edited: 'blue' }
// One row of the review table (the data-label attributes drive the mobile card layout).
export default function ReviewCard({ item, onOpen }) {
  return (
    <tr>
      <td data-label="Case"><div className="case-title">{item.title}</div></td>
      <td data-label="Risk"><RiskBadge level={item.risk} /></td>
      <td data-label="Jurisdiction">{item.jurisdiction}</td>
      <td data-label="Date">{item.date ? formatDate(item.date) : ''}</td>
      <td data-label="Status">
        <span className="row">
          <Badge variant={STATUS_VARIANT[item.status] || 'neutral'}>{item.status}</Badge>
          {item.unsaved && <Badge title="Not saved to the server">Not saved</Badge>}
        </span>
      </td>
      <td data-label=""><Button size="sm" onClick={onOpen} aria-label={`Open case: ${item.title}`}>Open case</Button></td>
    </tr>
  )
}
