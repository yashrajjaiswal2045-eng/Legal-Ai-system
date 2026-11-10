export default function DocumentCard({ doc }) {
  return (
    <div className="card row">
      <div style={{ flex: 1 }}><strong>{doc.name}</strong><div className="meta">{doc.type}, {doc.date}</div></div>
      <span>{doc.status}</span><button>Open</button><button className="danger">Delete</button>
    </div>
  )
}
