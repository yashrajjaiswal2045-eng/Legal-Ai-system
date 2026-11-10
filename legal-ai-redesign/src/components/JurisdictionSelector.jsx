import { DOMAINS, STATES } from '../constants'
import { SelectField } from './ui/Field'
// Edits the same { country, state, domain } object the API layer already expects.
export default function JurisdictionSelector({ value, onChange, idPrefix = 'jur' }) {
  const setCountry = (country) => onChange({ ...value, country, state: STATES[country][0] })
  return (
    <>
      <SelectField id={`${idPrefix}-country`} label="Country" value={value.country} onChange={(e) => setCountry(e.target.value)} options={Object.keys(STATES)} />
      <SelectField id={`${idPrefix}-state`} label="State / region" value={value.state} onChange={(e) => onChange({ ...value, state: e.target.value })} options={STATES[value.country]} />
      <SelectField id={`${idPrefix}-domain`} label="Legal domain" value={value.domain} onChange={(e) => onChange({ ...value, domain: e.target.value })} options={DOMAINS} />
    </>
  )
}
