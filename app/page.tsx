import fallbackData from "../content/data.json";
import { Hero } from "../components/Hero";
import { Marquee } from "../components/Marquee";
import { Services } from "../components/Services";
import { Clients } from "../components/Clients";
import { Process } from "../components/Process";
import { Belief } from "../components/Belief";
import { CaseStudies } from "../components/CaseStudies";
import { About } from "../components/About";
import { BookCall } from "../components/BookCall";
import { Contact } from "../components/Contact";

export default function Page() {
  // Load content directly from JSON file
  const content = fallbackData as any;

  const hero = content.hero;
  const marquee: string[] = Array.from(
    content.marquee?.items || content.marquee || []
  );
  const services = content.services;
  const processContent = content.process;
  const aboutContent = content.about;
  const bookContent = content.book;
  const contactContent = content.contact;
  const caseStudiesContent = content.caseStudies;
  const clientsHeading = content.clients;
  const clientsLogos: { src: string; alt: string }[] = Array.from(
    content.clientLogos
  );
  const beliefs: { title: string; quote: string }[] = Array.from(
    content.beliefs?.items || content.beliefs || []
  );

  return (
    <>
      <Hero hero={hero} />
      <Marquee marquee={marquee} />
      <Services services={services} />
      <Process process={processContent} />
      {beliefs[0] && (
        <Belief title={beliefs[0].title} quote={beliefs[0].quote} />
      )}
      <About about={aboutContent} />
      {beliefs[1] && (
        <Belief title={beliefs[1].title} quote={beliefs[1].quote} />
      )}
      <BookCall book={bookContent} />
      <Contact contact={contactContent} />
    </>
  );
}
