import { motion } from 'framer-motion'

// Hand-sketched Colombo skyline (1500 × 600, ground at y = 560) in light-blue linework.
// Each landmark is drafted in turn, sweeping left → right, with a faint offset second pass
// for a pen-on-paper feel. Tall landmarks sit on the right so the CTA copy stays clear.

const G = 560
const EASE = [0.65, 0, 0.35, 1]
const rect = (x, y, w, h) => `M${x} ${y} H${x + w} V${y + h} H${x} Z`
const hl = (x1, x2, y) => `M${x1} ${y} H${x2}`
const vl = (x, y1, y2) => `M${x} ${y1} V${y2}`
const range = (n, f) => Array.from({ length: n }, (_, i) => f(i))
const lerp = (a, b, t) => a + (b - a) * t

function waves() {
  const out = []
  ;[572, 584, 596].forEach((y, row) => {
    let x = row * 37
    let k = 0
    while (x < 1500) {
      const len = 60 + ((k * 53 + row * 29) % 70)
      let d = `M${x} ${y}`
      for (let s = 0; s < len; s += 20) d += ' q5 -3.5 10 0 t10 0'
      out.push(d)
      x += len + 30 + ((k * 31) % 40)
      k++
    }
  })
  return out
}

// Altair's leaning tower: floor lines interpolated between its sloping edges
const lean = { bl: [1216, G], br: [1250, G], tl: [1194, 232], tr: [1224, 222] }
const leanFloors = range(22, (i) => {
  const t = (i + 1) / 23
  return `M${lerp(lean.bl[0], lean.tl[0], t)} ${lerp(lean.bl[1], lean.tl[1], t)} L${lerp(lean.br[0], lean.tr[0], t)} ${lerp(lean.br[1], lean.tr[1], t)}`
})

const LANDMARKS = [
  {
    x: 0,
    name: 'sea',
    o: 0.35,
    paths: [
      ...waves(),
      // oruwa — outrigger canoe
      'M226 582 Q252 592 282 582',
      'M254 582 V546',
      'M254 548 Q272 558 278 578 H254',
      'M242 585 L238 594 M268 585 L264 594 M228 596 H274',
    ],
  },
  {
    x: 0,
    name: 'promenade',
    paths: [hl(0, 1500, G), hl(0, 620, 552), ...range(26, (i) => vl(i * 24, 552, G)), 'M120 560 V528 M114 528 H126', 'M470 560 V528 M464 528 H476'],
    o: 0.45,
  },
  {
    x: 60,
    name: 'galle face hotel',
    paths: [
      rect(60, 500, 240, 60),
      'M54 500 H306 M60 500 L70 490 H290 L300 500',
      'M160 490 L180 472 L200 490',
      hl(60, 300, 544),
      ...range(10, (i) => `M${72 + i * 22} 540 V530 a6 6 0 0 1 12 0 V540`),
      ...range(10, (i) => `M${74 + i * 22} 520 V512 a4 4 0 0 1 8 0 V520`),
    ],
  },
  {
    x: 320,
    name: 'palms',
    paths: [
      'M330 560 C333 530 326 502 334 476',
      'M334 476 q-18 -2 -30 12 M334 476 q-14 -12 -30 -10 M334 476 q10 -14 26 -12 M334 476 q18 0 28 14 M334 476 q2 -12 -4 -22',
      'M362 560 C364 536 358 514 364 494',
      'M364 494 q-16 -2 -26 10 M364 494 q-12 -10 -26 -8 M364 494 q10 -12 22 -10 M364 494 q16 0 24 12',
    ],
  },
  {
    x: 380,
    name: 'pettah',
    paths: [
      rect(382, 514, 50, 46),
      rect(432, 500, 44, 60),
      'M428 500 L454 484 L480 500',
      rect(476, 520, 40, 40),
      rect(516, 504, 44, 56),
      'M512 504 H564 M516 498 H560',
      ...range(3, (i) => rect(390 + i * 14, 526, 8, 10)),
      ...range(2, (i) => rect(442 + i * 16, 516, 9, 12)),
      ...range(3, (i) => rect(524 + i * 12, 518, 7, 12)),
    ],
  },
  {
    x: 580,
    name: 'red mosque',
    paths: [
      rect(586, 480, 70, 80),
      ...range(9, (i) => hl(586, 656, 488 + i * 7.5)),
      'M606 560 V534 a15 15 0 0 1 30 0 V560',
      'M586 480 a8 8 0 0 1 16 0 M640 480 a8 8 0 0 1 16 0 M606 480 a15 15 0 0 1 30 0',
      rect(578, 450, 8, 30),
      'M578 450 L582 440 L586 450',
      rect(656, 450, 8, 30),
      'M656 450 L660 440 L664 450',
      vl(621, 465, 456),
    ],
  },
  {
    x: 680,
    name: 'old parliament',
    paths: [
      'M680 560 H830 M684 554 H826 M688 548 H822',
      rect(692, 500, 126, 8),
      ...range(8, (i) => `M${700 + i * 15.5} 508 V548 M${704 + i * 15.5} 508 V548`),
      'M696 500 L755 472 L814 500',
      'M740 492 H770',
      'M755 472 V446 M755 446 h13 l-3 4 l3 4 h-13',
    ],
  },
  {
    x: 850,
    name: 'clock tower',
    paths: [
      'M858 560 L861 392 M882 560 L879 392',
      hl(859, 881, 470),
      hl(860, 880, 430),
      'M877 410 a7 7 0 1 0 -14 0 a7 7 0 1 0 14 0 M870 410 V405 M870 410 h4',
      'M853 392 H887 M856 386 H884',
      rect(862, 366, 16, 20),
      'M866 366 V386 M874 366 V386',
      'M860 366 L870 353 L880 366',
      vl(870, 353, 342),
    ],
  },
  {
    x: 905,
    name: 'independence hall',
    paths: [
      'M905 560 H1035 M910 552 H1030 M915 544 H1025',
      ...range(8, (i) => `M${926 + i * 12.5} 512 V544`),
      'M910 512 H1030',
      'M912 510 L930 495 H1010 L1028 510',
      'M934 495 L950 482 H990 L1006 495',
      'M960 482 L970 474 L980 482',
    ],
  },
  {
    x: 1048,
    name: 'wtc',
    paths: [
      rect(1055, 200, 36, 360),
      rect(1100, 206, 36, 354),
      'M1063 200 V190 H1083 V200 M1108 206 V196 H1128 V206',
      ...range(24, (i) => hl(1055, 1091, 214 + i * 14)),
      ...range(24, (i) => hl(1100, 1136, 220 + i * 14)),
      vl(1073, 200, 560),
      vl(1118, 206, 560),
      rect(1046, 522, 100, 38),
    ],
    fine: true,
  },
  {
    x: 1150,
    name: 'altair',
    paths: [
      rect(1158, 182, 36, 378),
      ...range(26, (i) => hl(1158, 1194, 196 + i * 14)),
      `M${lean.bl[0]} ${lean.bl[1]} L${lean.tl[0]} ${lean.tl[1]} L${lean.tr[0]} ${lean.tr[1]} L${lean.br[0]} ${lean.br[1]}`,
      ...leanFloors,
    ],
    fine: true,
  },
  {
    x: 1260,
    name: 'cinnamon life',
    paths: [
      'M1264 560 V198 Q1286 164 1310 186 V560',
      ...range(6, (i) => vl(1270 + i * 7, 200 - (i < 3 ? i * 5 : (6 - i) * 4), 560)),
    ],
    fine: true,
  },
  {
    x: 1320,
    name: 'lotus tower',
    accent: true,
    paths: [
      'M1322 560 V528 H1428 V560',
      'M1336 528 V512 H1414 V528',
      ...range(6, (i) => vl(1342 + i * 13, 528, 560)),
      'M1366 512 L1369 150 M1384 512 L1381 150',
      'M1362 400 H1388 M1363 300 H1387 M1364 220 H1386',
      'M1369 150 C1340 138 1336 104 1375 64 C1414 104 1410 138 1381 150',
      'M1375 150 C1362 120 1364 94 1375 76 C1386 94 1388 120 1375 150',
      'M1369 150 C1352 128 1348 110 1356 92 M1381 150 C1398 128 1402 110 1394 92',
      'M1375 64 V12 M1371 40 H1379 M1372 26 H1378',
    ],
  },
  {
    x: 700,
    name: 'sky',
    o: 0.4,
    paths: [
      'M700 142 q6 -6 12 0 q6 -6 12 0',
      'M742 120 q5 -5 10 0 q5 -5 10 0',
      'M780 150 q4 -4 8 0 q4 -4 8 0',
      'M1180 108 q18 -18 42 -6 q16 -16 38 0 q20 -4 24 12 H1180',
      'M1420 150 q12 -12 28 -4 q12 -10 26 2 H1420',
    ],
  },
]

const LABELS = [
  { x: 1310, y: 44, anchor: 'end', text: 'LOTUS TOWER · 350 m', lead: 'M1314 40 L1356 58' },
  { x: 1176, y: 168, text: 'ALTAIR' },
  { x: 180, y: 462, text: 'GALLE FACE' },
  { x: 755, y: 434, text: 'OLD PARLIAMENT' },
]

function Pass({ offset = 0, opacity = 1 }) {
  return (
    <g transform={offset ? `translate(${offset} ${-offset * 0.7})` : undefined} opacity={opacity}>
      {LANDMARKS.map((lm) => {
        const delay = 0.15 + (lm.x / 1500) * 1.8 + (offset ? 0.35 : 0)
        return (
          <g key={lm.name} stroke={lm.accent ? '#3CC8FF' : '#90E0EF'} strokeOpacity={lm.o ?? (lm.accent ? 0.75 : 0.55)}>
            {lm.paths.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill="none"
                strokeWidth={lm.fine && i > 2 ? 0.6 : 1.1}
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  show: {
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      pathLength: { duration: 1.5, delay: delay + Math.min(i, 30) * 0.02, ease: EASE },
                      opacity: { duration: 0.2, delay: delay + Math.min(i, 30) * 0.02 },
                    },
                  },
                }}
              />
            ))}
          </g>
        )
      })}
    </g>
  )
}

export default function ColomboSketch({ className = '' }) {
  return (
    <motion.svg
      viewBox="0 0 1500 600"
      preserveAspectRatio="xMaxYMax slice"
      className={className}
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* construction guides */}
      <motion.g
        stroke="#90E0EF"
        strokeOpacity="0.18"
        strokeDasharray="3 6"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1 } } }}
      >
        <path d="M980 200 H1500 M1375 0 V600 M0 472 H1500" />
      </motion.g>

      <Pass />
      <Pass offset={1.6} opacity={0.35} />

      {/* Lotus Tower height */}
      <motion.g
        stroke="#3CC8FF"
        strokeOpacity="0.6"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 2.6, duration: 0.8 } } }}
      >
        <path d="M1452 560 V12 M1446 566 L1458 554 M1446 18 L1458 6" strokeWidth="0.9" />
        <text x="1466" y="300" fill="#3CC8FF" fillOpacity="0.8" stroke="none" fontSize="12" fontFamily="JetBrains Mono, monospace" letterSpacing="2" transform="rotate(90 1466 300)" textAnchor="middle">
          350 m
        </text>
      </motion.g>

      <motion.g className="max-lg:hidden" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 2.4, duration: 0.8 } } }}>
        {LABELS.map((l) => (
          <g key={l.text}>
            {l.lead && <path d={l.lead} stroke="#90E0EF" strokeOpacity="0.5" strokeWidth="0.8" fill="none" />}
            <text x={l.x} y={l.y} textAnchor={l.anchor || 'middle'} fill="#90E0EF" fillOpacity="0.65" fontSize="11" fontFamily="JetBrains Mono, monospace" letterSpacing="2">
              {l.text}
            </text>
          </g>
        ))}
      </motion.g>
    </motion.svg>
  )
}
