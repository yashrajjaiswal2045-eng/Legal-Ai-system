export default function Tabs({ tabs, value, onChange, label }) {
  const move = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const next = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length
    onChange(tabs[next].id)
    document.getElementById(`tab-${tabs[next].id}`)?.focus()
  }
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((t, i) => (
        <button key={t.id} id={`tab-${t.id}`} role="tab" type="button" className="tab" aria-selected={value === t.id} tabIndex={value === t.id ? 0 : -1} aria-controls="tab-panel" onClick={() => onChange(t.id)} onKeyDown={(e) => move(e, i)}>
          {t.label}{t.count !== undefined && <span className="tab-count">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}
