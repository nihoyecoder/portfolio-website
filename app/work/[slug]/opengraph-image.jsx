import { caseStudySlugs, getCaseStudy } from "@/data/case-studies";
import { caseImage, ogSize, ogType } from "@/lib/og";

// Link preview per case study, in the project's colours (see lib/og.jsx).
export const alt = "Case study by Manoj Rawat, Product Designer";
export const size = ogSize;
export const contentType = ogType;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  return caseImage(getCaseStudy(slug).project);
}
