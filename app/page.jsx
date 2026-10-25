import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HashAlign from "@/components/layout/HashAlign";
import Contact from "@/components/sections/Contact/Contact";
import Hero from "@/components/sections/Hero/Hero";
import Journey from "@/components/sections/Journey/Journey";
import Process from "@/components/sections/Process/Process";
import Work from "@/components/sections/Work/Work";

// Homepage palette (header, sections, footer). Selected Work keeps its own
// per-project colours and fades in from these.
const PALETTE = {
  background: "#f2ecec",
  text: "#27242f",
  accent: "#c4546a",
};

export const viewport = {
  themeColor: PALETTE.background,
};

export default function HomePage() {
  return (
    <>
      <style>{`:root{--background:${PALETTE.background};--foreground:${PALETTE.text};--muted:color-mix(in srgb,${PALETTE.text} 72%,${PALETTE.background});--accent:${PALETTE.accent}}`}</style>
      <Header intro />
      <main>
        <Hero />
        <Work />
        <Journey />
        <Process />
        <Contact />
      </main>
      <Footer />
      <HashAlign />
    </>
  );
}
