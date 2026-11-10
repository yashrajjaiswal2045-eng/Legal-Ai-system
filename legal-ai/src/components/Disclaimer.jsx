export default function Disclaimer({ long }) {
  return <p className="disc">Legal.AI provides informational guidance and draft assistance, not legal representation.{long && ' Urgent, criminal, high-value and court matters require professional legal review. The system can be wrong, so verify important information.'}</p>
}
