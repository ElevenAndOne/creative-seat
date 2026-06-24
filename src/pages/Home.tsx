import CtaBanner from "../sections/cta";
import ModernMarketing from "../sections/pitch";
import Expertise from "../sections/expertise";
import Faq from "../sections/faq";
import FasterOutput from "../sections/benefits";
import Hero from "../sections/hero";
import HighImpact from "../sections/performance";
import Intelligence from "../sections/tools";
import LogoMarquee from "../sections/clients";
import NoHiring from "../sections/team";
import Process from "../sections/process";
import SiteFooter from "../sections/footer";
import SiteHeader from "../sections/header";
import Testimonials from "../sections/testimonials";
import WorkShowcase from "../sections/projects";


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
