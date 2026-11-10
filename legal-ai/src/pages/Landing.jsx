import Disclaimer from '../components/Disclaimer'
export default function Landing({ start, upload }) {
  return (
    <div className="hero">
      <h1>Legal.AI</h1>
      <h2>AI-powered legal guidance and document drafting</h2>
      <p>Get plain-language guidance with sources, draft letters and notices, and download them as DOCX or PDF. Sensitive matters can be sent to a human reviewer.</p>
      <div className="row"><button className="primary" onClick={start}>Start Consultation</button><button onClick={upload}>Upload Document</button></div>
      <p><strong>Urgent, criminal, high-value and court matters require professional legal review.</strong></p>
      <Disclaimer />
    </div>
  )
}
