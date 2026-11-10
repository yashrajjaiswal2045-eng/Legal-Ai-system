export default function CitationCard({ source }) {
  return (
    <div className="cite">
      <strong>Source {source.id}: {source.title}</strong>
      <div className="meta">{source.type}, {source.jurisdiction}, {source.date}</div>
      <p>{source.excerpt}</p>
      <button onClick={() => alert('Demo: the source viewer will open here.')}>View source</button>
    </div>
  )
}
