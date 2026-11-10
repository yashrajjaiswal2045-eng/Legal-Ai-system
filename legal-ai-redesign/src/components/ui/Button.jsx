import Icon from './Icon'
// variant: primary | secondary | ghost | danger | danger-solid.  size: sm | md | lg
export default function Button({ variant = 'secondary', size = 'md', icon, iconOnly, loading, className = '', children, type = 'button', ...rest }) {
  return (
    <button type={type} className={`btn btn-${variant} btn-${size} ${iconOnly ? 'btn-icon' : ''} ${className}`} disabled={rest.disabled || loading} {...rest}>
      {loading ? <span className="spinner" aria-hidden="true" /> : icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
      {children}
    </button>
  )
}
