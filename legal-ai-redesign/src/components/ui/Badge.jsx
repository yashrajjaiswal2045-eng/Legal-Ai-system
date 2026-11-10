import Icon from './Icon'
export default function Badge({ variant = 'neutral', icon, children, className = '' }) {
  return <span className={`badge badge-${variant} ${className}`}>{icon && <Icon name={icon} size={13} />}{children}</span>
}
