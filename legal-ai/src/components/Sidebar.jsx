const LINKS = [['consultation', 'New Consultation'], ['dashboard', 'My Conversations'], ['documents', 'Documents'], ['drafts', 'Drafts'], ['dashboard', 'Saved Cases'], ['review', 'Review Status'], ['settings', 'Settings']]
export default function Sidebar({ page, go, logout }) {
  return (
    <nav className="side">
      <div className="logo">Legal.AI</div>
      {LINKS.map(([id, label]) => <button key={label} className={page === id ? 'on' : ''} onClick={() => go(id)}>{label}</button>)}
      <div className="grow" />
      <span>Asha Roy</span>
      <button onClick={logout}>Logout</button>
    </nav>
  )
}
