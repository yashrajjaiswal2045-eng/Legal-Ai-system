// All backend calls live here. Each function tries FastAPI first, then falls back to mock data.
const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api'
const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms))

async function request(path, options, mock, adapt) {
  try {
    const res = await fetch(BASE + path, options)
    if (!res.ok) throw new Error('Server error ' + res.status)
    const data = await res.json()
    return adapt ? adapt(data) : data // convert FastAPI shape -> shape the UI expects
  } catch {
    await wait()
    return typeof mock === 'function' ? mock() : mock // backend unavailable -> demo data
  }
}
const post = (body) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

const SOURCES = [
  { id: 1, title: 'Consumer Protection Act, 2019', type: 'Statute', jurisdiction: 'India', date: '2019-08-09', excerpt: 'Section 35: A complaint may be filed with the District Commission where the opposite party resides or the cause of action arose.' },
  { id: 2, title: 'West Bengal Premises Tenancy Act, 1997', type: 'Statute', jurisdiction: 'India / West Bengal', date: '1997-03-01', excerpt: 'Section 4: The landlord must refund the security deposit after deducting lawful dues when the tenancy ends.' },
]
const CHECKS = { citations: true, dates: true, names: true, fields: true, consistency: true }
const HIGH = /criminal|arrest|police|court|fir|urgent|lakh|crore/i

// Backend has no verification step yet, so we honestly report every check as not done.
const NOT_VERIFIED = { citations: false, dates: false, names: false, fields: false, consistency: false }
const DOC_TYPES = { 'Consumer Complaint': 'consumer_complaint', 'RTI Application': 'rti_application', 'Rental Letter': 'rental_letter', 'Employment Letter': 'employment_letter', 'Legal Notice': 'legal_notice', 'Agreement Template': 'agreement_template' }
const toSource = (s, i) => ({ id: i + 1, title: s.title, type: s.source_type, jurisdiction: '', date: '', excerpt: s.url })
const toReview = (r) => ({ id: r.document_id, title: r.title, risk: r.risk_level, jurisdiction: r.jurisdiction, date: r.date, status: r.status, question: r.question, facts: r.facts, reasoning: r.reasoning, draft: r.draft, sources: r.sources.map(toSource) })

export const askQuestion = (question, j) =>
  request('/chat', post({ message: question, jurisdiction: j.country, state: j.state, domain: j.domain }), () => ({
    id: Date.now(), sources: SOURCES, verification: CHECKS,
    risk: HIGH.test(question) ? 'high' : /deposit|salary|refund/i.test(question) ? 'medium' : 'low',
    answer: `Based on general ${j.domain} law in ${j.state}, ${j.country}: start with a written notice to the other party, keep copies of all proof, and approach the proper forum if there is no reply. Check the time limit for your case. I can help you draft a notice next.`,
  }), (d) => ({ id: Date.now(), answer: d.answer, risk: d.risk_level, sources: d.sources.map(toSource), verification: NOT_VERIFIED }))
export const uploadDocument = (file) => {
  const form = new FormData(); form.append('file', file)
  return request('/documents/upload', { method: 'POST', body: form }, () => ({ id: Date.now(), name: file.name, status: 'processed' }),
    (d) => ({ id: d.document_id, name: d.filename, status: d.status }))
}
export const getConversations = () =>
  request('/conversations', {}, [
    { id: 1, title: 'Security deposit not returned', date: '2026-10-01', jurisdiction: 'West Bengal, India', category: 'Rental', risk: 'medium', status: 'Answered' },
    { id: 2, title: 'RTI for road repair status', date: '2026-09-27', jurisdiction: 'West Bengal, India', category: 'RTI', risk: 'low', status: 'Draft ready' },
    { id: 3, title: 'Police complaint after theft', date: '2026-09-20', jurisdiction: 'West Bengal, India', category: 'Other', risk: 'high', status: 'In review' },
  ])
export const getConversation = (id) => request('/conversations/' + id, {}, { id, messages: [] })
export const generateDraft = (type, f) =>
  request('/documents/draft', post({ document_type: DOC_TYPES[type], jurisdiction: f.jurisdiction.country, state: f.jurisdiction.state,
    facts: { name: f.name, address: f.address, opposite: f.opposite, date: f.date, amount: f.amount, issue: f.incident, additional_facts: f.facts } }),
  () => ({
    id: Date.now(), type, verification: { ...CHECKS, dates: !!f.date },
    text: `${type.toUpperCase()}\n\nDate: ${f.date || '[date missing]'}\nFrom: ${f.name}, ${f.address}\nTo: ${f.opposite}\n\nSubject: ${type} regarding Rs. ${f.amount || '0'}\n\nSir/Madam,\n\n${f.incident}\n\n${f.facts || ''}\n\nI request you to resolve this within 15 days, failing which I may take further legal steps.\n\nYours faithfully,\n${f.name}`,
  }), (d) => ({ id: d.document_id, type, text: d.content, verification: { ...NOT_VERIFIED, fields: true, dates: !!f.date } }))
export const getDraft = (id) => request('/documents/' + id, {}, { id, text: '' }, (d) => ({ id: d.document_id, text: d.content }))
// Downloads: first save any edits the user made in the editor (PUT), then fetch the real file.
async function download(id, text, ext) {
  try {
    await fetch(`${BASE}/documents/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: text }) })
    const res = await fetch(`${BASE}/documents/${id}/download/${ext}`)
    if (!res.ok) throw new Error()
    return await res.blob()
  } catch { await wait(400); return new Blob([text], { type: 'text/plain' }) } // backend down -> demo file
}
export const downloadDocx = (id, text) => download(id, text, 'docx')
export const downloadPdf = (id, text) => download(id, text, 'pdf')
export const submitForReview = (payload) =>
  request('/review', post({ question: payload.question || 'Review requested' }), { reviewId: Date.now(), status: 'Pending' }, (d) => ({ reviewId: d.document_id, status: d.status }))
// Real backend returns only real cases (empty list at first); mock list is used when the backend is down.
export const getReviewStatus = () =>
  request('/review', {}, [
    { id: 1, title: 'Police complaint after theft', risk: 'high', jurisdiction: 'West Bengal, India', date: '2026-09-20', status: 'Pending', question: 'My bike was stolen and the police refuse to register an FIR. What can I do?', facts: ['Theft on 2026-09-18', 'FIR refused at local station', 'Bike value about Rs. 90,000'], reasoning: 'Criminal matter with possible police inaction. The AI gave general steps only and flagged it for lawyer review.', draft: 'To the Superintendent of Police,\nI request registration of an FIR for the theft of my motorcycle...', sources: SOURCES },
    { id: 2, title: 'Employment termination notice', risk: 'medium', jurisdiction: 'India', date: '2026-09-25', status: 'Pending', question: 'My employer ended my job without notice. Is that allowed?', facts: ['Contract requires 30 days notice', 'Terminated on 2026-09-22'], reasoning: 'Contract dispute; the notice clause appears breached.', draft: 'Legal notice regarding breach of notice period...', sources: SOURCES.slice(0, 1) },
  ], (list) => list.map(toReview))
