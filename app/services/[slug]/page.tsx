import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbSchema } from "../../../components/BreadcrumbSchema";
import { ServicePageView } from "../../../components/ServicePageView";
import {
  generateServicePageSchema,
  mapServiceData,
} from "../../../content/page-schemas";
import { generateBreadcrumbSchema } from "../../../lib/breadcrumbs";
import seoServiceData from "../../../content/service-seo-analytics.json";
import geoServiceData from "../../../content/service-generative-engine-optimization.json";
import servicesData from "../../../content/services.json";

type Props = { params: { slug: string } };

const SERVICE_DATA_BY_SLUG: Record<string, typeof seoServiceData> = {
  "seo-analytics": seoServiceData,
  "generative-engine-optimization": geoServiceData,
};

export async function generateStaticParams() {
  return Object.keys(SERVICE_DATA_BY_SLUG).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = SERVICE_DATA_BY_SLUG[params.slug];
  if (!data) return {};

  return {
    title: data.seo.title,
    description: data.seo.description,
    keywords: data.seo.keywords,
    alternates: { canonical: data.seo.canonical },
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      url: data.seo.canonical,
      type: "website",
    },
  };
}

export default function ServicePage({ params }: Props) {
  const data = SERVICE_DATA_BY_SLUG[params.slug];
  if (!data) return notFound();

  const breadcrumbSchema = generateBreadcrumbSchema(
    `/services/${params.slug}`,
    data.hero.title
  );

  const serviceItem = servicesData.services.items.find(
    (s) => mapServiceData(s).slug === params.slug
  );
  if (!serviceItem) return notFound();

  const serviceData = mapServiceData(serviceItem);
  const serviceSchema = generateServicePageSchema(serviceData);

  return (
    <>
      <BreadcrumbSchema schema={breadcrumbSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServicePageView data={data} slug={params.slug} />
    </>
  );
}
