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
import { ContactForm } from "../components/ContactForm";

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
      <ContactForm
        title="Tell me about your project"
        subtitle="We'll get back within 1–2 business days."
        fields={[
          {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
            placeholder: "Name",
          },
          {
            name: "email",
            label: "Email Address",
            type: "email",
            required: true,
            placeholder: "Email Address",
          },
          {
            name: "phone",
            label: "Contact Number",
            type: "tel",
            required: false,
            placeholder: "Contact Number",
          },
          {
            name: "message",
            label: "Tell me about your project",
            type: "textarea",
            required: true,
            placeholder: "Tell me about your project",
            rows: 6,
          },
        ]}
        submitLabel="Send"
        submitAriaLabel="Send message"
        contactDetails={{
          email: contactContent.email,
          phone: contactContent.phone,
          location: contactContent.location,
          socials: contactContent.socials,
        }}
      />
    </>
  );
}
