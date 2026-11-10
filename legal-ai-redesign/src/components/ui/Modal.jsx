import { useEffect, useRef } from 'react'
export default function Modal({ open, title, children, footer, onClose }) {
  const box = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose // keep latest handler without re-running the effect (which would steal focus)
  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    box.current?.focus()
    const onKey = (e) => e.key === 'Escape' && closeRef.current?.()
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); previous?.focus?.() }
  }, [open])
  if (!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1} ref={box}>
        <h2 className="modal-title" id="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
