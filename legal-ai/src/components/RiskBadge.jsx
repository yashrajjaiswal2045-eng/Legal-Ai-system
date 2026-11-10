const LABEL = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' }
export default function RiskBadge({ level }) {
  return <span className={'badge ' + level}>{LABEL[level]}</span>
}
