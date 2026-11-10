import { useEffect, useRef, useState } from 'react'
import Icon from './ui/Icon'
import Button from './ui/Button'
export default function Navbar({ title, subtitle, jurisdiction, onMenu }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const away = (e) => !wrap.current?.contains(e.target) && setOpen(false)
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc) }
  }, [open])
  return (
    <header className="topbar">
      <Button className="menu-btn" variant="ghost" iconOnly icon="menu" aria-label="Open navigation" onClick={onMenu} />
      <h1 className="topbar-title">{title}</h1>
      {subtitle && <span className="topbar-sub">{subtitle}</span>}
      <span className="spacer" />
      <span className="jur-pill" title="Selected jurisdiction and legal domain">
        <Icon name="pin" size={14} />{jurisdiction.state}, {jurisdiction.country}<span aria-hidden="true">·</span>{jurisdiction.domain}
      </span>
      <div className="popover-wrap" ref={wrap}>
        <Button variant="ghost" iconOnly icon="bell" aria-label="Notifications" aria-expanded={open} onClick={() => setOpen(!open)} />
        {open && (
          <div className="popover" role="dialog" aria-label="Notifications">
            <div className="empty" style={{ padding: '28px 16px' }}>
              <div className="empty-icon"><Icon name="bell" size={20} /></div>
              <h3>No notifications</h3>
              <p className="small">Review updates will appear here once notifications are connected.</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
