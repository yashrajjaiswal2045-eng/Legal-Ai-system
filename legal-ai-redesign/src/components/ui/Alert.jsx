import Icon from './Icon'
const ICON = { info: 'info', success: 'checkCircle', warning: 'alert', error: 'alertCircle' }
export default function Alert({ variant = 'info', title, children, action, onDismiss }) {
  return (
    <div className={`alert alert-${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <Icon name={ICON[variant]} size={18} />
      <div className="alert-body">{title && <strong className="alert-title">{title}</strong>}{children}</div>
      {action && <div className="alert-action">{action}</div>}
      {onDismiss && <button type="button" className="alert-x" aria-label="Dismiss message" onClick={onDismiss}><Icon name="x" size={16} /></button>}
    </div>
  )
}
