import RiskBadge from './RiskBadge'
export default function ReviewCard({ item, onOpen }) {
  return (
    <div className="card row">
      <div style={{ flex: 1 }}><strong>{item.title}</strong><div className="meta">{item.jurisdiction}, {item.date}</div></div>
      <RiskBadge level={item.risk} /><span>{item.status}</span><button onClick={onOpen}>Open case</button>
    </div>
  )
}
