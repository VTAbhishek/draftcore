import { lazy, Suspense, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import Preloader from './components/Preloader.jsx'
import Cursor from './components/Cursor.jsx'
import SheetLoader from './components/SheetLoader.jsx'
import { LogoMark } from './components/Logo.jsx'
import { startSmoothScroll, stopSmoothScroll, scrollToTop } from './lib/smoothScroll.js'
import Home from './pages/Home.jsx'

const About = lazy(() => import('./pages/About.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail.jsx'))
const Projects = lazy(() => import('./pages/Projects.jsx'))
const WhyDraftCore = lazy(() => import('./pages/WhyDraftCore.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const EASE = [0.76, 0, 0.24, 1]

// Curtain that covers the outgoing page (grows from the bottom) and reveals the incoming one (shrinks to the top).
function Curtain() {
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] flex origin-bottom items-center justify-center bg-surface"
        variants={{ initial: { scaleY: 0 }, enter: { scaleY: 0 }, exit: { scaleY: 1, transition: { duration: 0.5, ease: EASE } } }}
      >
        <LogoMark className="h-12 w-auto opacity-80" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] flex origin-top items-center justify-center bg-surface"
        variants={{ initial: { scaleY: 1 }, enter: { scaleY: 0, transition: { duration: 0.6, ease: EASE, delay: 0.05 } }, exit: { scaleY: 0 } }}
      >
        <LogoMark className="h-12 w-auto opacity-80" />
      </motion.div>
    </>
  )
}

export default function App() {
  const location = useLocation()
  const firstRender = useRef(true)

  useEffect(() => {
    startSmoothScroll()
    firstRender.current = false
    return stopSmoothScroll
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
        <motion.main key={location.pathname} initial={firstRender.current ? false : 'initial'} animate="enter" exit="exit">
          <Curtain />
          <Suspense fallback={<SheetLoader />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/why-draftcore" element={<WhyDraftCore />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppButton />
    </MotionConfig>
  )
}
