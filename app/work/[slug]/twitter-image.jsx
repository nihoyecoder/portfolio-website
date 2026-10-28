import { caseStudySlugs, getCaseStudy } from "@/data/case-studies";
import { caseImage, ogSize, ogType } from "@/lib/og";

// Same card as the case study's Open Graph image, for Twitter / X.
export const alt = "Case study by Manoj Rawat, AI Product Designer";
export const size = ogSize;
export const contentType = ogType;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  return caseImage(getCaseStudy(slug).project);
}
