import Hero from '../components/hero/Hero.jsx'
import CapabilityTicker from '../components/sections/CapabilityTicker.jsx'
import Intro from '../components/sections/Intro.jsx'
import ServiceExplorer from '../components/sections/ServiceExplorer.jsx'
import StageTimeline from '../components/sections/StageTimeline.jsx'
import WhyGrid from '../components/sections/WhyGrid.jsx'
import Showcase from '../components/sections/Showcase.jsx'
import Audiences from '../components/sections/Audiences.jsx'
import CTASection from '../components/CTASection.jsx'
import useSeo from '../hooks/useSeo.js'

export default function Home() {
  useSeo()
  return (
    <>
      <Hero />
      <CapabilityTicker />
      <Intro />
      <ServiceExplorer index="01" />
      <StageTimeline index="02" />
      <WhyGrid index="03" />
      <Showcase index="04" />
      <Audiences />
      <CTASection />
    </>
  )
}
