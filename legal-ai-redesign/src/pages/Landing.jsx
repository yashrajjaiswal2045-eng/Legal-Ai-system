import Logo from '../components/Logo'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'
import AppPreview from '../components/AppPreview'

const FEATURES = [
  ['message', 'AI consultation', 'Describe your situation in plain language and get clear, general guidance for your jurisdiction.'],
  ['pen', 'Document drafting', 'Generate a first draft of a complaint, notice or letter, edit it, and download it as DOCX or PDF.'],
  ['book', 'Source-grounded answers', 'Answers are shown with their sources and a verification status so you can check them. Source retrieval is still being built.'],
  ['userCheck', 'Human review', 'High-risk matters are flagged, and you can request review by a qualified person.'],
]
const STEPS = [
  ['Describe your situation', 'Choose your jurisdiction and legal area, then explain what happened in your own words.'],
  ['Review guidance and sources', 'Read the plain-language answer, its risk level, its sources and what has been verified.'],
  ['Draft, check and download', 'Turn the guidance into a draft document, edit it, and download it. Sensitive matters can go to human review.'],
]

export default function Landing({ start, draft }) {
  return (
    <div>
      <header className="l-nav">
        <div className="container">
          <Logo />
          <nav className="l-links" aria-label="Page sections">
            <a href="#features">Features</a><a href="#how">How it works</a><a href="#responsible">Responsible use</a>
          </nav>
          <span className="spacer" />
          <Button variant="primary" onClick={start}>Open app</Button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <div>
              <span className="eyebrow"><Icon name="scale" size={15} />Informational guidance and drafting assistance</span>
              <h1>Legal guidance, made clearer.</h1>
              <p className="hero-lede">Legal.AI gives plain-language, informational legal guidance and helps you draft letters and complaints. It shows its sources, flags risky matters, and points you to a qualified lawyer when it matters.</p>
              <div className="hero-ctas">
                <Button variant="primary" size="lg" icon="arrowRight" onClick={start}>Start Consultation</Button>
                <Button size="lg" icon="pen" onClick={draft}>Draft a Document</Button>
              </div>
              <ul className="ticks">
                <li><Icon name="checkCircle" size={17} />Plain-language answers for your state or region</li>
                <li><Icon name="checkCircle" size={17} />Risk level and verification status on every answer</li>
                <li><Icon name="checkCircle" size={17} />Human review for high-risk matters</li>
              </ul>
            </div>
            <AppPreview />
          </div>
        </section>

        <section className="section section-alt" id="features">
          <div className="container">
            <div className="section-head"><h2>Built for clarity and caution</h2><p>Everything is designed to help you understand your options without pretending to be a lawyer.</p></div>
            <div className="feature-grid">
              {FEATURES.map(([icon, title, text]) => (
                <div className="card feature" key={title}><div className="type-ico"><Icon name={icon} size={20} /></div><h3>{title}</h3><p>{text}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="container">
            <div className="section-head"><h2>How it works</h2><p>Three steps from a question to a draft you can use.</p></div>
            <ol className="steps">
              {STEPS.map(([title, text], i) => (
                <li className="step-card" key={title}><span className="num">0{i + 1}</span><h3>{title}</h3><p>{text}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="band" id="responsible">
          <div className="container">
            <div>
              <h2>Not a replacement for a lawyer</h2>
              <p>Legal.AI provides informational guidance and draft assistance, not legal representation. It can be wrong or out of date, so verify anything important.</p>
            </div>
            <ul>
              <li><Icon name="alert" size={18} />Criminal, urgent, high-value and court matters require review by a qualified legal professional.</li>
              <li><Icon name="shieldCheck" size={18} />Drafts are starting points. Check every name, date and amount before you use them.</li>
              <li><Icon name="lock" size={18} />This is an academic prototype. Do not enter sensitive personal information you are not comfortable sharing.</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="l-footer">
        <div className="container"><Logo /><span>Legal.AI is a college project prototype. It does not provide legal advice.</span></div>
      </footer>
    </div>
  )
}
