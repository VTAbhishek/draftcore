import { ShieldCheck, FileCheck, Ruler, SlidersHorizontal } from 'lucide-react'

export const site = {
  name: 'DraftCore Solutions PVT LTD',
  shortName: 'DraftCore',
  tagline: 'Your extended design and technical delivery team.',
  email: 'info@draftcoresolutions.com',
  phone: '+94 71 444 9070',
  phoneHref: 'tel:+94714449070',
  // Set to null to hide the WhatsApp button until a dedicated WhatsApp number is confirmed.
  whatsapp: '94714449070',
  website: 'www.draftcoresolutions.com',
  url: 'https://www.draftcoresolutions.com',
}

// Home hero background video (files in public/media). The current files are an auto-generated
// placeholder animation — replace them with final footage, keeping the same file names or updating these paths.
// `phases`: [startSecond, phaseIndex] pairs that drive the HUD readout; set to null for footage that
// doesn't follow the blueprint → section → render sequence.
export const heroVideo = {
  desktop: { webm: 'media/hero-desktop.webm', mp4: 'media/hero-desktop.mp4', poster: 'media/hero-desktop.jpg' },
  mobile: { webm: 'media/hero-mobile.webm', mp4: 'media/hero-mobile.mp4', poster: 'media/hero-mobile.jpg' },
  phases: [
    [0, 0],
    [5.6, 1],
    [10, 2],
    [16, 1],
    [18.4, 0],
  ],
}

export const defaultDescription =
  'DraftCore Solutions provides BIM modelling, CAD interior documentation, shop drawings, interior design support, project delivery services and FF&E solutions from concept through handover.'

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services', dropdown: true },
  { label: 'Projects', to: '/projects' },
  { label: 'Why DraftCore', to: '/why-draftcore' },
  { label: 'Contact', to: '/contact' },
]

export const capabilities = [
  'Revit BIM — Up to LOD 300',
  'CAD Interior Documentation — CD / SD / DD / Tender / IFC',
  'Fit-Out & Joinery Shop Drawings',
  'Interior Design Support',
  'Project Delivery & Site Services',
  'FF&E Solutions',
]

export const audiences = [
  'Interior design studios',
  'Architects',
  'Contractors',
  'Joinery & fabrication companies',
  'Value engineering providers',
  'Developers and project teams',
]

export const differentiators = [
  {
    icon: ShieldCheck,
    title: 'Single accountable partner',
    text: 'Design, BIM, documentation, site support and FF&E under one contract.',
  },
  {
    icon: FileCheck,
    title: 'Documentation you can build from',
    text: 'Defined standards at every project stage.',
  },
  {
    icon: Ruler,
    title: 'Interior specialists, not generalists',
    text: 'Strong focus on fit-out and joinery detail.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Flexible, scalable capacity',
    text: 'Resource can increase or reduce by package or project stage.',
  },
]

export const stats = [
  { value: 6, label: 'Service streams under one contract' },
  { value: 300, prefix: 'LOD ', label: 'Revit ID & Architecture modelling' },
  { value: 5, label: 'Documentation stages, CD through IFC' },
  { value: 1, label: 'Single accountable partner' },
]

export const stages = [
  { code: 'CD', name: 'Concept Design', text: 'Concept development, mood boards and presentation drawings.' },
  { code: 'SD', name: 'Schematic Design', text: 'Plans, elevations and coordinated schematic sets.' },
  { code: 'DD', name: 'Design Development', text: 'Developed BIM models, details and specifications.' },
  { code: 'Tender', name: 'Tender', text: 'Documentation that contractors can price without reinterpretation.' },
  { code: 'IFC', name: 'Issued for Construction', text: 'IFC drawing sets and fabrication-level shop drawings.' },
  { code: 'Site', name: 'Delivery & Handover', text: 'Site supervision, snagging, quality control and FF&E supply.' },
]

export const projectCategories = ['Hospitality', 'Residential', 'Commercial', 'Retail', 'F&B', 'Joinery', 'Fit-Out']
