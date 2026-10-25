import { notFound } from "next/navigation";
import CaseStudy from "@/components/case-study/CaseStudy";
import Footer from "@/components/layout/Footer";
import Header, { HeaderSpace } from "@/components/layout/Header";
import { caseStudySlugs, getCaseStudy } from "@/data/case-studies";

// One page per project in data/projects.js, built at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return {};
  const { project, study } = caseStudy;
  return {
    title: `${project.title} case study`,
    description: study.summary ?? project.description,
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) notFound();

  const { theme } = caseStudy.study;

  return (
    <>
      {/* A case study can retheme the whole page (header, sections, footer). */}
      {theme && (
        <style>{`:root{--background:${theme.background};--foreground:${theme.text};--muted:color-mix(in srgb,${theme.text} 72%,${theme.background});--line:${theme.line}}`}</style>
      )}
      <Header />
      <div className="pt-5 md:pt-6">
        <HeaderSpace />
      </div>
      <main>
        <CaseStudy {...caseStudy} />
      </main>
      <Footer />
    </>
  );
}
