export default function LoadingIndicator({ label = 'Working' }) {
  return <span className="dots" role="status" aria-label={label}><span /><span /><span /></span>
}
