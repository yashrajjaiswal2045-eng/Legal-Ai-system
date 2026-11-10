import Badge from './ui/Badge'
import Button from './ui/Button'
const isUrl = (s) => /^https?:\/\//i.test(s || '')
export default function CitationCard({ source, demo }) {
  const link = isUrl(source.excerpt) ? source.excerpt : null
  return (
    <article className="cite">
      <div className="cite-title">Source {source.id}: {source.title}</div>
      <div className="cite-meta">
        {source.type && <Badge variant="blue">{source.type}</Badge>}
        {source.jurisdiction && <span>{source.jurisdiction}</span>}
        {source.date && <span>{source.date}</span>}
        {demo && <Badge>Sample</Badge>}
      </div>
      {!link && source.excerpt && <blockquote className="cite-excerpt" style={{ margin: '8px 0' }}>{source.excerpt}</blockquote>}
      {link ? (
        <a className="btn btn-secondary btn-sm" href={link} target="_blank" rel="noopener noreferrer">View source</a>
      ) : (
        <Button size="sm" disabled title="No link is available for this source">View source</Button>
      )}
    </article>
  )
}
