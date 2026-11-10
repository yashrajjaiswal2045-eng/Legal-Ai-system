// Labelled form controls. Each wires up label, hint and error text for screen readers.
function Shell({ id, label, hint, error, required, children }) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{label}{required && <span className="req" aria-hidden="true">*</span>}</label>
      {children}
      {hint && !error && <span className="field-hint" id={`${id}-hint`}>{hint}</span>}
      {error && <span className="field-error" id={`${id}-err`} role="alert">{error}</span>}
    </div>
  )
}
const describe = (id, hint, error) => (error ? `${id}-err` : hint ? `${id}-hint` : undefined)

export function TextField({ id, label, hint, error, required, ...rest }) {
  return (
    <Shell {...{ id, label, hint, error, required }}>
      <input id={id} className="input" aria-invalid={!!error} aria-required={required} aria-describedby={describe(id, hint, error)} {...rest} />
    </Shell>
  )
}
export function TextAreaField({ id, label, hint, error, required, ...rest }) {
  return (
    <Shell {...{ id, label, hint, error, required }}>
      <textarea id={id} className="textarea" aria-invalid={!!error} aria-required={required} aria-describedby={describe(id, hint, error)} {...rest} />
    </Shell>
  )
}
export function SelectField({ id, label, hint, options, ...rest }) {
  return (
    <Shell {...{ id, label, hint }}>
      <select id={id} className="select" aria-describedby={describe(id, hint)} {...rest}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Shell>
  )
}
