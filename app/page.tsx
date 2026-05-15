import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import WhatIsBlockchain from '@/components/WhatIsBlockchain'
import StrategicAreas from '@/components/StrategicAreas'
import Process from '@/components/Process'
import Impact from '@/components/Impact'
import Roadmap from '@/components/Roadmap'
import Team from '@/components/Team'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <WhatIsBlockchain />
        <StrategicAreas />
        <Process />
        <Impact />
        <Roadmap />
        <Team />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
