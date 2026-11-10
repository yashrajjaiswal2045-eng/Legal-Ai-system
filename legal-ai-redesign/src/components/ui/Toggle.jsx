export default function Toggle({ id, label, description, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div>
        <div id={`${id}-l`} style={{ fontWeight: 500 }}>{label}</div>
        {description && <div className="muted small">{description}</div>}
      </div>
      <button type="button" role="switch" id={id} className="switch" aria-checked={checked} aria-labelledby={`${id}-l`} onClick={() => onChange(!checked)} />
    </div>
  )
}
