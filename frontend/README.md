# DraftCore Solutions — website

React 18 + Vite, Tailwind CSS, Framer Motion, three.js (@react-three/fiber). PHP enquiry handler for Apache/XAMPP.

## Run

All commands run from the `frontend/` folder.

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173  (/api/* is proxied to XAMPP Apache)
npm run build      # outputs frontend/dist/
```

To preview the build from XAMPP at `http://localhost/Draftcore/frontend/dist/`:

```bash
VITE_BASE=/Draftcore/frontend/dist/ npm run build
```

For production, upload the contents of `dist/` to the web root. `dist/.htaccess` handles SPA routing.

## Where things live

| What | File |
| --- | --- |
| Contact details, nav, stats, differentiators, stages | `src/data/site.js` |
| The six services and their detail-page content | `src/data/services.js` |
| Portfolio (currently **placeholder samples**) | `src/data/projects.js` |
| Hero video (paths + HUD phase timings) | `heroVideo` in `src/data/site.js`, files in `public/media/` |
| Light / dark section themes | CSS variables in `src/index.css` — add `theme-light` to a section |
| Enquiry form | `src/components/ContactForm.jsx` |
| Enquiry handler (validation, uploads, email) | `public/api/contact.php` |

## Hero video

`public/media/hero-desktop.*` (1920×1080) and `hero-mobile.*` (900×1500, portrait) are an **auto-generated
placeholder** — a 20-second seamless loop rendered from a three.js scene (blueprint linework → section cut →
lit dusk render). To use final footage, replace the `.mp4`, `.webm` and `.jpg` poster files (or update the
paths in `heroVideo`), and set `heroVideo.phases` to `null` if the new footage doesn't follow that sequence.
Keep each file around 2–4 MB (H.264 CRF ~28–30, `-movflags +faststart`, no audio track).

Visitors with "reduce motion" enabled see the poster image instead of the video; everyone gets a pause button.

## Enquiry handler

- Every enquiry is appended to `storage/enquiries.jsonl` and uploads go to `storage/uploads/<id>/`.
  `storage/` is created at `frontend/storage/` in development (outside `dist/`) and web access is denied via `.htaccess`.
- Email is sent with PHP `mail()` to `info@draftcoresolutions.com`. It needs SMTP configured on the host
  (XAMPP does not send mail by default; the enquiry is still saved).
- Limits: 5 files, 10 MB each, 25 MB total; PDF, DWG, DXF, RVT, IFC, JPG, PNG, ZIP. Honeypot + 30 s per-IP rate limit.

## Before launch (from the brief, section 12)

- Replace the sample projects in `src/data/projects.js` with approved projects and imagery.
- Confirm the WhatsApp number (`site.whatsapp`; set to `null` to hide the button).
- Add privacy policy / cookie notice, analytics, and company address if it is to be published.
- Final approval of all service descriptions.
