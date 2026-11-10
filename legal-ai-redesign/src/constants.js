// Shared option lists used by several pages.
export const STATES = {
  India: ['West Bengal', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
}
export const DOMAINS = ['Consumer', 'Rental', 'Employment', 'RTI', 'Contract', 'Other']
export const PROMPTS = [
  'My landlord has not returned my security deposit.',
  'Help me draft a consumer complaint.',
  'I need an RTI application draft.',
  'Help me understand this employment agreement.',
]
// Names must match the keys used in services/api.js
export const DOC_TYPES = [
  { name: 'Consumer Complaint', icon: 'bag', desc: 'Defective product or poor service' },
  { name: 'RTI Application', icon: 'search', desc: 'Request information from a public authority' },
  { name: 'Rental Letter', icon: 'building', desc: 'Deposit, rent or tenancy issue' },
  { name: 'Employment Letter', icon: 'briefcase', desc: 'Notice, salary or termination matter' },
  { name: 'Legal Notice', icon: 'mail', desc: 'Formal notice before further action' },
  { name: 'Agreement Template', icon: 'pen', desc: 'Starting point for a written agreement' },
]
