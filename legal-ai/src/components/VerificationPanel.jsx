const ITEMS = { citations: 'Citations checked', dates: 'Dates checked', names: 'Names checked', fields: 'Required fields checked', consistency: 'Document consistency checked' }
export default function VerificationPanel({ checks }) {
  const failed = Object.values(checks).includes(false)
  return (
    <div className="card">
      <h3>Verification</h3>
      {Object.entries(ITEMS).map(([k, label]) => <div key={k}>{checks[k] ? '✓' : '⚠'} {label}</div>)}
      {failed && <p className="badge high">Verification required</p>}
    </div>
  )
}
