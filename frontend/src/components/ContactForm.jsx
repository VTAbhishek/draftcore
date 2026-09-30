import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Upload, FileText, X, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { services } from '../data/services.js'
import { projectCategories, site } from '../data/site.js'

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || `${import.meta.env.BASE_URL}api/contact.php`

const DELIVERABLES = ['CD', 'SD', 'DD', 'Tender', 'IFC', 'Shop drawings', 'Coloured plans', 'Specifications', 'Materials boards', 'FF&E supply']
const ACCEPT = ['pdf', 'dwg', 'dxf', 'rvt', 'ifc', 'jpg', 'jpeg', 'png', 'zip']
const MAX_FILES = 5
const MAX_FILE = 10 * 1024 * 1024
const MAX_TOTAL = 25 * 1024 * 1024

const PREFILL = {
  capability: 'Please send us the DraftCore capability statement.',
  quotation: 'We would like to request a quotation for the following scope:\n',
}

const blank = {
  name: '',
  company: '',
  jobTitle: '',
  email: '',
  phone: '',
  projectType: '',
  service: '',
  location: '',
  startDate: '',
  deliverables: [],
  message: '',
  fileLink: '',
  consent: false,
  website: '', // honeypot
}

const fmtSize = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`)

function Field({ id, label, required, error, hint, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-[13px] font-medium text-body">
        <span>
          {label} {required && <span className="text-accent">*</span>}
        </span>
        {hint && <span className="font-mono text-[10px] uppercase tracking-wider text-faint">{hint}</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-rose-300"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContactForm() {
  const [params] = useSearchParams()
  const [data, setData] = useState(() => {
    const s = services.find((x) => x.slug === params.get('service'))
    return { ...blank, service: s ? s.title : '', message: PREFILL[params.get('enquiry')] || '' }
  })
  const [files, setFiles] = useState([])
  const [fileError, setFileError] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverError, setServerError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef(null)

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setData((d) => ({ ...d, [key]: value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const toggleDeliverable = (d) =>
    setData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.includes(d) ? prev.deliverables.filter((x) => x !== d) : [...prev.deliverables, d],
    }))

  const addFiles = (list) => {
    let next = [...files]
    let err = ''
    for (const f of list) {
      const ext = f.name.split('.').pop().toLowerCase()
      if (!ACCEPT.includes(ext)) {
        err = `${f.name}: file type not accepted`
        continue
      }
      if (f.size > MAX_FILE) {
        err = `${f.name} is larger than 10 MB — please share a download link instead`
        continue
      }
      if (next.length >= MAX_FILES) {
        err = `You can attach up to ${MAX_FILES} files`
        break
      }
      if (!next.some((n) => n.name === f.name && n.size === f.size)) next.push(f)
    }
    if (next.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL) {
      err = 'Total attachments exceed 25 MB — please share a download link instead'
      next = files
    }
    setFiles(next)
    setFileError(err)
  }

  const validate = () => {
    const e = {}
    if (!data.name.trim()) e.name = 'Please enter your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = 'Please enter a valid email address'
    if (!data.service) e.service = 'Please choose the service you need'
    if (data.message.trim().length < 10) e.message = 'Please tell us a little about the scope'
    if (!data.consent) e.consent = 'We need your consent to reply to this enquiry'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    const first = Object.keys(e)[0]
    if (first) {
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    setStatus('sending')
    setServerError('')
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      fd.append(k, Array.isArray(v) ? v.join(', ') : typeof v === 'boolean' ? (v ? 'yes' : 'no') : v)
    })
    files.forEach((f) => fd.append('files[]', f))
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: fd })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) throw new Error(json.error || 'The enquiry could not be sent.')
      setStatus('success')
    } catch (err) {
      setServerError(err.message)
      setStatus('error')
    }
  }

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`Project enquiry — ${data.company || data.name}`)}&body=${encodeURIComponent(
    `Name: ${data.name}\nCompany: ${data.company}\nService: ${data.service}\nProject type: ${data.projectType}\nLocation: ${data.location}\n\n${data.message}`,
  )}`

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass flex flex-col items-center rounded-3xl p-10 text-center sm:p-16"
        role="status"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="mt-6 font-display text-3xl font-semibold text-ink">Project details received</h3>
        <p className="mt-3 max-w-md text-muted">
          Thank you, {data.name.split(' ')[0]}. The DraftCore team will review your brief and be in touch at {data.email}.
        </p>
        <button
          type="button"
          onClick={() => {
            setData(blank)
            setFiles([])
            setStatus('idle')
          }}
          className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-ink"
        >
          Send another enquiry
        </button>
      </motion.div>
    )
  }

  const inv = (k) => ({ 'aria-invalid': errors[k] ? 'true' : undefined, 'aria-describedby': errors[k] ? `f-${k}-error` : undefined })

  return (
    <form onSubmit={submit} noValidate className="glass relative rounded-3xl p-6 sm:p-10">
      <div className="flex items-center justify-between border-b border-line/10 pb-6">
        <div>
          <p className="eyebrow">Project enquiry</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">Send your project</h2>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-faint sm:block">Form · DC-ENQ</span>
      </div>

      {/* honeypot — hidden from people, visible to naive bots */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={data.website} onChange={set('website')} />
        </label>
      </div>

      <fieldset className="mt-8 grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">Your details</legend>
        <Field id="f-name" label="Name" required error={errors.name}>
          <input id="f-name" className="field" autoComplete="name" value={data.name} onChange={set('name')} {...inv('name')} />
        </Field>
        <Field id="f-company" label="Company">
          <input id="f-company" className="field" autoComplete="organization" value={data.company} onChange={set('company')} />
        </Field>
        <Field id="f-jobTitle" label="Job title">
          <input id="f-jobTitle" className="field" autoComplete="organization-title" value={data.jobTitle} onChange={set('jobTitle')} />
        </Field>
        <Field id="f-email" label="Email" required error={errors.email}>
          <input id="f-email" type="email" className="field" autoComplete="email" value={data.email} onChange={set('email')} {...inv('email')} />
        </Field>
        <Field id="f-phone" label="Phone / WhatsApp" className="sm:col-span-2">
          <input id="f-phone" type="tel" className="field" autoComplete="tel" value={data.phone} onChange={set('phone')} />
        </Field>
      </fieldset>

      <fieldset className="mt-10 grid gap-5 border-t border-line/10 pt-8 sm:grid-cols-2">
        <legend className="sr-only">Project</legend>
        <Field id="f-projectType" label="Project type">
          <select id="f-projectType" className="field" value={data.projectType} onChange={set('projectType')}>
            <option value="">Select…</option>
            {projectCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
            <option>Other</option>
          </select>
        </Field>
        <Field id="f-service" label="Required service" required error={errors.service}>
          <select id="f-service" className="field" value={data.service} onChange={set('service')} {...inv('service')}>
            <option value="">Select…</option>
            {services.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
            <option>Multiple services / not sure yet</option>
          </select>
        </Field>
        <Field id="f-location" label="Project location">
          <input id="f-location" className="field" value={data.location} onChange={set('location')} />
        </Field>
        <Field id="f-startDate" label="Expected start date">
          <input id="f-startDate" type="date" className="field [color-scheme:dark]" value={data.startDate} onChange={set('startDate')} />
        </Field>

        <div className="sm:col-span-2">
          <p className="mb-3 text-[13px] font-medium text-body">Required deliverables</p>
          <div className="flex flex-wrap gap-2">
            {DELIVERABLES.map((d) => {
              const on = data.deliverables.includes(d)
              return (
                <button
                  type="button"
                  key={d}
                  aria-pressed={on}
                  onClick={() => toggleDeliverable(d)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                    on
                      ? 'border-accent bg-accent/15 text-ink shadow-[0_0_16px_-6px_#3CC8FF]'
                      : 'border-line/10 text-muted hover:border-line/30 hover:text-ink'
                  }`}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>

        <Field id="f-message" label="Message / scope" required error={errors.message} className="sm:col-span-2">
          <textarea
            id="f-message"
            rows={5}
            className="field resize-y"
            placeholder="Tell us about the project, stage, programme and what you need from DraftCore."
            value={data.message}
            onChange={set('message')}
            {...inv('message')}
          />
        </Field>
      </fieldset>

      <div className="mt-10 border-t border-line/10 pt-8">
        <p className="mb-3 text-[13px] font-medium text-body">Upload drawings / reference files</p>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInput.current?.click()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), fileInput.current?.click())}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            addFiles(e.dataTransfer.files)
          }}
          className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
            dragging ? 'border-accent bg-accent/10' : 'border-line/10 hover:border-accent/40 hover:bg-line/[0.02]'
          }`}
        >
          {dragging && <div className="absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-brand-sky/20 to-transparent" />}
          <Upload className={`h-8 w-8 transition ${dragging ? 'text-accent' : 'text-faint'}`} />
          <p className="mt-4 text-sm text-ink">
            Drag &amp; drop files, or <span className="text-accent underline underline-offset-4">browse</span>
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-faint">
            PDF · DWG · DXF · RVT · IFC · JPG · PNG · ZIP — max 10 MB each, 25 MB total
          </p>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept={ACCEPT.map((e) => `.${e}`).join(',')}
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>
        {fileError && (
          <p className="mt-3 text-xs text-rose-300" role="alert">
            {fileError}
          </p>
        )}
        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((f) => (
              <li key={f.name + f.size} className="flex items-center gap-3 rounded-xl border border-line/10 bg-surface-2/60 px-4 py-3 text-sm">
                <FileText className="h-4 w-4 shrink-0 text-accent" />
                <span className="truncate text-ink">{f.name}</span>
                <span className="ml-auto shrink-0 font-mono text-[11px] text-faint">{fmtSize(f.size)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${f.name}`}
                  onClick={() => setFiles((fs) => fs.filter((x) => x !== f))}
                  className="rounded-full p-1 text-faint hover:bg-line/10 hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <Field id="f-fileLink" label="Or share a link to larger files" hint="Drive · WeTransfer · Dropbox" className="mt-5">
          <input id="f-fileLink" type="url" className="field" placeholder="https://" value={data.fileLink} onChange={set('fileLink')} />
        </Field>
      </div>

      <div className="mt-10 border-t border-line/10 pt-8">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input
            id="f-consent"
            type="checkbox"
            checked={data.consent}
            onChange={set('consent')}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-line/20 bg-surface-2 accent-[rgb(var(--accent))]"
            {...inv('consent')}
          />
          <span>I consent to DraftCore Solutions contacting me about this enquiry and storing the details I have provided.</span>
        </label>
        {errors.consent && (
          <p id="f-consent-error" className="mt-2 text-xs text-rose-300">
            {errors.consent}
          </p>
        )}

        {status === 'error' && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              {serverError} You can also{' '}
              <a href={mailto} className="underline underline-offset-4 hover:text-ink">
                email your details directly
              </a>
              .
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="group relative mt-8 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-cyan via-brand-sky to-brand-electric px-8 py-4 font-semibold text-obsidian transition hover:brightness-110 disabled:opacity-70 sm:w-auto glow-cyan"
        >
          {status === 'sending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send Project Details <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
