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
import { getAllCaseStudies } from "../content/case-studies";

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

  // Get dynamic case studies from TypeScript files
  const allCaseStudies = getAllCaseStudies();
  const caseStudiesContent = {
    title: "Real Results from Real Clients",
    intro: "See how our data-driven approach delivers sustainable growth.",
    items: allCaseStudies.map((cs) => ({
      slug: cs.slug,
      title: cs.title,
      category: cs.category,
      image: cs.image,
      summary: cs.summary,
      results: cs.results.slice(0, 3).map((r) => `${r.value} ${r.metric}`),
      link: `/case-studies/${cs.slug}`,
      linkLabel: "Read case study",
    })),
    cta: {
      label: "View all case studies",
      href: "/case-studies",
    },
  };
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
      <CaseStudies caseStudies={caseStudiesContent} />
      <BookCall book={bookContent} />
      <ContactForm
        title="Tell us about your project"
        subtitle="We'll get back within 1–2 business days."
        fields={[
          {
            name: "name",
            label: "Full Name",
            type: "text",
            required: true,
            placeholder: "Your name",
          },
          {
            name: "email",
            label: "Email Address",
            type: "email",
            required: true,
            placeholder: "your@email.com",
          },
          {
            name: "company",
            label: "Company",
            type: "text",
            required: false,
            placeholder: "Your company name",
          },
          {
            name: "website",
            label: "Website",
            type: "url",
            required: false,
            placeholder: "https://yourwebsite.com",
          },
          {
            name: "services",
            label: "Services Interested In",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select services..." },
              { value: "seo", label: "SEO & Analytics" },
              { value: "ppc", label: "PPC & Paid Media" },
              { value: "web-dev", label: "Web Design & Development" },
              { value: "content", label: "Content & Email Marketing" },
              { value: "brand", label: "Brand & Creative" },
              { value: "strategy", label: "Growth Strategy" },
              { value: "multiple", label: "Multiple Services" },
              { value: "not-sure", label: "Not Sure - Need Consultation" },
            ],
          },
          {
            name: "budget",
            label: "Monthly Marketing Budget",
            type: "select",
            required: false,
            options: [
              { value: "", label: "Select budget range..." },
              { value: "under-2k", label: "Under $2,000" },
              { value: "2k-5k", label: "$2,000 - $5,000" },
              { value: "5k-10k", label: "$5,000 - $10,000" },
              { value: "10k-25k", label: "$10,000 - $25,000" },
              { value: "25k-plus", label: "$25,000+" },
              { value: "project-based", label: "One-time project" },
            ],
          },
          {
            name: "message",
            label: "Tell us about your project",
            type: "textarea",
            required: true,
            placeholder:
              "Describe your business goals, current challenges, and what you're hoping to achieve with digital marketing...",
            rows: 5,
          },
        ]}
        submitLabel="Send Message"
        submitAriaLabel="Send contact form message"
        contactDetails={{
          email: contactContent.email,
          phone: contactContent.phone,
          location: contactContent.location,
          socials: [
            {
              platform: "Instagram",
              href: "https://www.instagram.com/maplegrowthdigital/",
              ariaLabel: "Follow MapleGrowth Digital on Instagram",
            },
            {
              platform: "YouTube",
              href: "https://youtube.com/@MapleGrowthDigital",
              ariaLabel: "Follow MapleGrowth Digital on YouTube",
            },
          ],
        }}
      />
    </>
  );
}
