import CtaBanner from "../sections/cat-banner";
import ModernMarketing from "../sections/modern-marketing";
import Expertise from "../sections/expertise";
import Faq from "../sections/faq";
import FasterOutput from "../sections/faster-output";
import Hero from "../sections/hero";
import HighImpact from "../sections/high-impact";
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
      <SiteHeader />
      <main>
        <Hero />
        <LogoMarquee />
        <ModernMarketing />
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
