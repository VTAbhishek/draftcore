import { Boxes, Layers, DraftingCompass, Palette, HardHat, Armchair } from 'lucide-react'

export const services = [
  {
    slug: 'bim-modelling',
    nav: 'BIM',
    number: '01',
    title: 'BIM Modelling & Documentation',
    short: 'BIM Modelling',
    card: 'Revit ID and Architecture models with documentation up to LOD 300.',
    intro:
      'Revit ID and Architecture models developed up to LOD 300, with full documentation issued across CD, SD, DD, Tender and IFC stages.',
    icon: Boxes,
    cta: 'Request BIM Support',
    tags: ['Revit', 'LOD 300', 'CD', 'SD', 'DD', 'Tender', 'IFC'],
    showStages: true,
    items: [
      {
        title: 'Revit ID Modelling & Documentation up to LOD 300',
        text: 'Interior models developed to LOD 300 with full documentation across CD, SD, DD, Tender and IFC stages.',
      },
      {
        title: 'Revit Architecture Modelling & Documentation up to LOD 300',
        text: 'Architectural models and drawing sets issued through CD, SD, DD, Tender and IFC.',
      },
      {
        title: 'Coordinated, standards-driven output',
        text: 'Consistent naming, sheet setup and family libraries so models transfer cleanly into the client environment.',
      },
    ],
  },
  {
    slug: 'cad-documentation',
    nav: 'CAD Documentation',
    number: '02',
    title: 'CAD Documentation',
    short: 'CAD Documentation',
    card: 'Complete ID documentation from CD through IFC.',
    intro: 'Complete interior documentation sets produced in CAD across CD, SD, DD, Tender and IFC stages.',
    icon: Layers,
    cta: 'Request Documentation',
    tags: ['Plans', 'RCPs', 'Elevations', 'Sections', 'Details'],
    showStages: true,
    items: [
      { title: 'Plans', text: 'Interior plans prepared to the level of detail each project stage requires.' },
      { title: 'RCPs', text: 'Reflected ceiling plans coordinating ceiling layouts, levels and fixtures.' },
      { title: 'Elevations', text: 'Interior elevations setting out finishes, joinery and wall treatments.' },
      { title: 'Sections', text: 'Sections that explain build-ups, heights and junctions.' },
      { title: 'Details', text: 'Construction details that resolve how the design is built.' },
      {
        title: 'Documentation coordination',
        text: 'Drawing sets kept consistent across disciplines and issues, from CD through IFC.',
      },
      {
        title: 'Coloured plans & elevations',
        text: 'Presentation-quality coloured plans and elevations for approvals, tender submissions and marketing use.',
      },
    ],
  },
  {
    slug: 'shop-drawings',
    nav: 'Shop Drawings',
    number: '03',
    title: 'Shop Drawings',
    short: 'Shop Drawings',
    card: 'Fabrication-level fit-out and joinery drawings.',
    intro: 'Fit-out and joinery shop drawings ready for fabrication and installation.',
    icon: DraftingCompass,
    cta: 'Request Documentation',
    tags: ['Joinery', 'Wall panelling', 'Ceilings', 'Loose furniture'],
    items: [
      { title: 'Joinery', text: 'Fabrication-level joinery drawings for workshop production.' },
      { title: 'Wall panelling', text: 'Panel layouts, setting-out and fixing details ready for fabrication.' },
      { title: 'Ceilings', text: 'Ceiling shop drawings coordinated with levels, bulkheads and services.' },
      { title: 'Loose furniture', text: 'Furniture drawings with the dimensions and materials needed to manufacture.' },
      { title: 'Site-condition coordination', text: 'Drawings aligned to actual site conditions before fabrication.' },
      {
        title: 'Manufacturer-standard coordination',
        text: 'Details coordinated with manufacturer standards so fabrication and installation run cleanly.',
      },
    ],
  },
  {
    slug: 'interior-design',
    nav: 'Interior Design',
    number: '04',
    title: 'Interior Design',
    short: 'Interior Design',
    card: 'Design development, coloured plans, elevations and specifications.',
    intro:
      'From concept mood boards to written specifications, DraftCore delivers design packages that contractors can price and build without reinterpretation.',
    icon: Palette,
    cta: 'Discuss Design Support',
    tags: ['Concept', 'Specifications', 'Materials boards'],
    items: [
      { title: 'Interior design service', text: 'Design support from concept development through technical design.' },
      { title: 'Coloured plans and elevations', text: 'Presentation drawings that communicate design intent clearly.' },
      { title: 'Specification writing', text: 'Written specifications that remove ambiguity for pricing and construction.' },
      { title: 'Materials boards preparation', text: 'Curated finishes and materials boards for client review and approval.' },
      { title: 'Vendor selection assistance', text: 'Support identifying and comparing suppliers for the specified design.' },
    ],
  },
  {
    slug: 'project-delivery',
    nav: 'Project Delivery',
    number: '05',
    title: 'Project Delivery & Site Services',
    short: 'Project Delivery',
    card: 'PMC, site supervision, vendor selection and value engineering.',
    intro: 'Support that connects design documentation with project execution, through the full delivery cycle.',
    icon: HardHat,
    cta: 'Discuss Project Support',
    tags: ['PMC', 'Site supervision', 'Snagging', 'Value engineering'],
    items: [
      {
        title: 'ID Project Management Consultancy',
        text: 'Programme, package and consultant coordination.',
      },
      {
        title: 'Site Supervision',
        text: 'Site inspections, snagging and quality control against approved ID details.',
      },
      {
        title: 'Vendor Selection Assistance',
        text: 'Sourcing, comparison and technical evaluation.',
      },
      {
        title: 'Value Engineering Assistance',
        text: 'Solutions to suit client budget while keeping quality consistent.',
      },
    ],
  },
  {
    slug: 'ffe-solutions',
    nav: 'FF&E',
    number: '06',
    title: 'FF&E Solutions',
    short: 'FF&E Solutions',
    card: 'Furniture, wallpaper, rugs, carpets and fabric reengineering supply.',
    intro: 'FF&E sourcing and supply support for interior projects — finishes and furnishings delivered to approved specifications.',
    icon: Armchair,
    cta: 'Request FF&E Support',
    tags: ['Furniture', 'Wallpaper', 'Rugs & carpets', 'Fabric'],
    items: [
      { title: 'Furniture supply', text: 'Loose and fixed furniture packages.' },
      { title: 'Wallpaper supply', text: 'Specification and supply of wallcoverings to approved finishes.' },
      { title: 'Rugs & carpets', text: 'Bespoke and stock rugs, broadloom and carpet tile supply.' },
      { title: 'Fabric reengineering', text: 'Upholstery and fabric re-specification to meet budget and performance.' },
    ],
  },
]

export const getService = (slug) => services.find((s) => s.slug === slug)
