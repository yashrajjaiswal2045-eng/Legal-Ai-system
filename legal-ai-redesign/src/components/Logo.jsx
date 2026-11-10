export default function Logo({ light }) {
  return (
    <span className={`logo ${light ? 'logo-light' : ''}`}>
      <span className="logo-mark" aria-hidden="true">§</span>
      <span className="logo-word">Legal<span>.AI</span></span>
    </span>
  )
}
