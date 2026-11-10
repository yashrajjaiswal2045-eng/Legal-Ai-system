import Icon from './ui/Icon'
import Badge from './ui/Badge'
const ITEMS = { citations: 'Citations checked', dates: 'Dates checked', names: 'Names checked', fields: 'Required fields checked', consistency: 'Document consistency checked' }
// checks: { citations, dates, names, fields, consistency } booleans. false = not verified.
export default function VerificationPanel({ checks = {}, demo }) {
  const keys = Object.keys(ITEMS)
  const passed = keys.filter((k) => checks[k] === true).length
  const incomplete = passed < keys.length
  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <span className="meter" aria-hidden="true">{keys.map((k) => <i key={k} className={checks[k] === true ? 'on' : ''} />)}</span>
        <strong className="small">{passed} of {keys.length} checks completed</strong>
        {incomplete && <Badge variant="amber" icon="alert">Verification required</Badge>}
        {demo && <Badge>Sample data</Badge>}
      </div>
      <ul className="verify-list">
        {keys.map((k) => (
          <li key={k} className={checks[k] === true ? 'verify-ok' : 'verify-no'}>
            <Icon name={checks[k] === true ? 'checkCircle' : 'alertCircle'} size={16} />
            <span style={{ color: 'var(--slate-900)' }}>{ITEMS[k]}</span>
            <span className="muted small">{checks[k] === true ? 'Passed' : 'Not verified'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
