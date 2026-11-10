import { useState } from 'react'
import Disclaimer from '../components/Disclaimer'
import JurisdictionSelector from '../components/JurisdictionSelector'
import Icon from '../components/ui/Icon'
import Alert from '../components/ui/Alert'
import Toggle from '../components/ui/Toggle'
import { TextField } from '../components/ui/Field'

const PRINCIPLES = [
  'Legal.AI provides information and draft assistance.',
  'It does not provide legal representation.',
  'Criminal, urgent, high-value and court matters require lawyer review.',
  'The system can be uncertain. Verify important information.',
]
function Section({ title, desc, children }) {
  return (
    <section className="set-grid">
      <div><h2>{title}</h2><p className="muted small">{desc}</p></div>
      <div>{children}</div>
    </section>
  )
}
export default function Settings({ jurisdiction, setJurisdiction }) {
  const [prefs, setPrefs] = useState({ review: true, drafts: true, tips: false, history: true, improve: false })
  const flip = (k) => (v) => setPrefs({ ...prefs, [k]: v })
  return (
    <div className="page">
      <div className="page-head"><h1>Settings</h1><p>Manage your profile and preferences.</p></div>
      <Alert variant="info" title="Prototype settings">Profile, notification and privacy choices are not saved in this prototype. The jurisdiction you pick here applies to your current session.</Alert>
      <div className="card card-pad" style={{ marginTop: 16 }}>
        <Section title="Profile" desc="How you appear in the application.">
          <div className="stack" style={{ maxWidth: 420 }}>
            <TextField id="s-name" label="Display name" defaultValue="Demo User" />
            <TextField id="s-email" label="Email" type="email" placeholder="you@example.com" />
          </div>
        </Section>
        <Section title="Jurisdiction preferences" desc="Used to tailor information and drafts.">
          <div className="stack" style={{ maxWidth: 420 }}><JurisdictionSelector value={jurisdiction} onChange={setJurisdiction} idPrefix="set" /></div>
        </Section>
        <Section title="Notifications" desc="Choose what you would like to hear about.">
          <Toggle id="n-review" label="Review updates" description="When a case you sent for review changes status." checked={prefs.review} onChange={flip('review')} />
          <Toggle id="n-drafts" label="Draft reminders" description="Reminders to check and finalise saved drafts." checked={prefs.drafts} onChange={flip('drafts')} />
          <Toggle id="n-tips" label="Product tips" checked={prefs.tips} onChange={flip('tips')} />
        </Section>
        <Section title="Privacy" desc="Control how your information is handled.">
          <Toggle id="p-history" label="Keep conversation history" description="Show past consultations in your dashboard." checked={prefs.history} onChange={flip('history')} />
          <Toggle id="p-improve" label="Help improve Legal.AI" description="Allow anonymised feedback to be used for evaluation." checked={prefs.improve} onChange={flip('improve')} />
        </Section>
        <Section title="Responsible use" desc="Please read before relying on any answer.">
          <ul className="principles">{PRINCIPLES.map((p) => <li key={p}><Icon name="shieldCheck" size={17} /><span>{p}</span></li>)}</ul>
          <div style={{ marginTop: 12 }}><Disclaimer long /></div>
        </Section>
      </div>
    </div>
  )
}
