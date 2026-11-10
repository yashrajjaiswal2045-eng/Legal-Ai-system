import Badge from './ui/Badge'
const MAP = {
  low: { label: 'Low Risk', variant: 'green', icon: 'shieldCheck' },
  medium: { label: 'Medium Risk', variant: 'amber', icon: 'alertCircle' },
  high: { label: 'High Risk', variant: 'red', icon: 'alert' },
}
// Icon + text + colour, so risk is never communicated by colour alone.
export default function RiskBadge({ level }) {
  const m = MAP[level]
  return m ? <Badge variant={m.variant} icon={m.icon}>{m.label}</Badge> : null
}
