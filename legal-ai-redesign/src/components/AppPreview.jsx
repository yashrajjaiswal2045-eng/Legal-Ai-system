import Icon from './ui/Icon'
import Badge from './ui/Badge'
// Static, illustrative picture of the consultation screen for the landing page. Not live data.
export default function AppPreview() {
  return (
    <figure style={{ margin: 0 }}>
      <div className="preview-stage">
        <div className="preview" aria-hidden="true">
          <div className="preview-top">
            <span className="row" style={{ gap: 8 }}><span className="logo-mark">§</span><strong>Consultation</strong></span>
            <span className="jur-pill" style={{ height: 26, fontSize: 12 }}><Icon name="pin" size={12} />West Bengal, India · Rental</span>
          </div>
          <div className="preview-body">
            <div className="msg msg-user"><div className="bubble">My landlord has not returned my security deposit. What can I do?</div></div>
            <div className="msg msg-ai">
              <div className="avatar-ai">§</div>
              <div className="ai-card">
                <div className="ai-head"><span className="ai-name">Legal.AI</span><Badge variant="amber" icon="alertCircle">Medium Risk</Badge><Badge icon="info">Informational</Badge></div>
                <p>In general, a landlord must return a deposit after deducting lawful dues once the tenancy ends. A written notice with a clear deadline is usually the first step. Keep proof of payment and your rental agreement.</p>
                <div className="row" style={{ marginTop: 12, gap: 8 }}>
                  <Badge variant="blue" icon="book">Sources (2)</Badge>
                  <Badge variant="amber" icon="shieldCheck">Verification required</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="preview-compose"><span>Describe your situation...</span><Icon name="send" size={16} /></div>
        </div>
      </div>
      <figcaption className="preview-caption">Illustrative example of the consultation screen, not a real consultation.</figcaption>
    </figure>
  )
}
