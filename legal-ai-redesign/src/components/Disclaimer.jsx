import Icon from './ui/Icon'
export default function Disclaimer({ long, className = '' }) {
  return (
    <p className={`disclaimer ${className}`}>
      <Icon name="info" size={14} />
      <span>
        Legal.AI provides informational guidance and draft assistance, not legal representation.
        {long && ' Urgent, criminal, high-value and court matters require professional legal review. The system can be wrong, so verify important information.'}
      </span>
    </p>
  )
}
