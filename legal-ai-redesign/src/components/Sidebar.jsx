import Icon from './ui/Icon'
import Logo from './Logo'
const MAIN = [['dashboard', 'Dashboard', 'layout'], ['consultation', 'Consultation', 'message'], ['drafts', 'Draft Document', 'pen'], ['documents', 'Documents', 'folder']]
const MORE = [['review', 'Review', 'userCheck'], ['settings', 'Settings', 'settings']]
export default function Sidebar({ page, go, logout, open, onClose }) {
  const item = ([id, label, icon]) => (
    <li key={id}>
      <button type="button" className="nav-item" aria-current={page === id ? 'page' : undefined} onClick={() => go(id)}>
        <Icon name={icon} size={18} />{label}
      </button>
    </li>
  )
  return (
    <>
      <div className={`scrim ${open ? 'open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <Logo light />
        <nav aria-label="Main">
          <div className="nav-label">Workspace</div>
          <ul>{MAIN.map(item)}</ul>
          <div className="nav-label">Oversight</div>
          <ul>{MORE.map(item)}</ul>
        </nav>
        <div className="sidebar-foot">
          <div className="user-chip">
            <span className="avatar-sm" aria-hidden="true">DU</span>
            <div><strong>Demo User</strong><span>No sign-in in this prototype</span></div>
          </div>
          <button type="button" className="nav-item" onClick={logout}><Icon name="logout" size={18} />Logout</button>
        </div>
      </aside>
    </>
  )
}
