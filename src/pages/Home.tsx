import SiteHeader from '../components/sections/SiteHeader'
import Hero from '../components/sections/Hero'
import LogoMarquee from '../components/sections/LogoMarquee'
import DesignedFor from '../components/sections/DesignedFor'
import NoHiring from '../components/sections/NoHiring'
import HighImpact from '../components/sections/HighImpact'
import FasterOutput from '../components/sections/FasterOutput'
import Process from '../components/sections/Process'
import Intelligence from '../components/sections/Intelligence'
import Testimonials from '../components/sections/Testimonials'
import Expertise from '../components/sections/Expertise'
import WorkShowcase from '../components/sections/WorkShowcase'
import Faq from '../components/sections/Faq'
import CtaBanner from '../components/sections/CtaBanner'
import SiteFooter from '../components/sections/SiteFooter'

export default function Home() {
  return (
    <>
      <div className="relative bg-brand-radial">
        <SiteHeader />
        <Hero />
      </div>
      <main>
        <LogoMarquee />
        <DesignedFor />
        <NoHiring />
        <HighImpact />
        <FasterOutput />
        <Process />
        <Intelligence />
        <Testimonials />
        <Expertise />
        <WorkShowcase />
        <Faq />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  )
}
