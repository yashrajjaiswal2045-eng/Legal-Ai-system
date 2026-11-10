import Disclaimer from '../components/Disclaimer'
export default function Settings() {
  return (
    <div className="page">
      <h1>Settings</h1>
      <div className="card"><h3>Profile</h3><label>Name</label><input defaultValue="Asha Roy" /><label>Email</label><input defaultValue="asha@example.com" /></div>
      <div className="card"><h3>Jurisdiction preferences</h3><label>Default state</label><select><option>West Bengal</option><option>Delhi</option></select></div>
      <div className="card"><h3>Notifications</h3><label><input type="checkbox" defaultChecked style={{ width: 'auto' }} /> Email me when a review is complete</label></div>
      <div className="card"><h3>Privacy</h3><label><input type="checkbox" style={{ width: 'auto' }} /> Save my conversations to history</label></div>
      <div className="card"><h3>Responsible use</h3>
        <ul><li>Legal.AI gives information and draft assistance.</li><li>It does not provide legal representation.</li><li>Criminal, urgent, high-value and court matters need a lawyer.</li><li>The system can be uncertain. Verify important information.</li></ul><Disclaimer /></div>
    </div>
  )
}
