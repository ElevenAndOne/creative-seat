import CtaBanner from "../sections/CtaBanner";
import DesignedFor from "../sections/DesignedFor";
import Expertise from "../sections/Expertise";
import Faq from "../sections/Faq";
import FasterOutput from "../sections/FasterOutput";
import Hero from "../sections/Hero";
import HighImpact from "../sections/HighImpact";
import Intelligence from "../sections/Intelligence";
import LogoMarquee from "../sections/LogoMarquee";
import NoHiring from "../sections/NoHiring";
import Process from "../sections/Process";
import SiteFooter from "../sections/SiteFooter";
import SiteHeader from "../sections/SiteHeader";
import Testimonials from "../sections/Testimonials";
import WorkShowcase from "../sections/WorkShowcase";


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
