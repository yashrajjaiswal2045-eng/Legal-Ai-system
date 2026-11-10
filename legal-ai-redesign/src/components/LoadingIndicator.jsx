export default function LoadingIndicator({ label = 'Loading' }) {
  return (
    <span className="dots" role="status" aria-label={label}>
      <span /><span /><span />
    </span>
  )
}
