export default function Navbar({ title, jurisdiction, setJurisdiction }) {
  const set = (k) => (e) => setJurisdiction({ ...jurisdiction, [k]: e.target.value })
  return (
    <header className="nav">
      <h2>{title}</h2>
      <select aria-label="Country" value={jurisdiction.country} onChange={set('country')}><option>India</option><option>United Kingdom</option></select>
      <select aria-label="State" value={jurisdiction.state} onChange={set('state')}><option>West Bengal</option><option>Maharashtra</option><option>Delhi</option></select>
      <select aria-label="Legal domain" value={jurisdiction.domain} onChange={set('domain')}>{['Consumer', 'Rental', 'Employment', 'RTI', 'Contract', 'Other'].map((d) => <option key={d}>{d}</option>)}</select>
      <button aria-label="Notifications" onClick={() => alert('No new notifications')}>🔔</button>
      <span>Asha Roy</span>
    </header>
  )
}
