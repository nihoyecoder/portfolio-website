import Image from "next/image";
import Link from "next/link";
import { contactLink, navLinks, site } from "@/lib/site";
import RollingText from "@/components/ui/RollingText";
import HeaderShell from "./HeaderShell";
import MobileMenu from "./MobileMenu";

// The nav row's height (logo, links, "Let's talk"); HeaderSpace reserves it.
const ROW = "h-5 md:h-[42px]";

// Editorial header, fixed to the top (HeaderShell hides it while scrolling
// down). On the home page (`intro`) the hero timeline staggers its
// `data-anim` items in.
export default function Header({ intro = false }) {
  return (
    <HeaderShell intro={intro}>
      <nav aria-label="Primary" className={`grid grid-cols-2 items-center text-sm md:grid-cols-12 ${ROW}`}>
        <Link
          href="/"
          data-anim="nav"
          aria-label={`${site.name}, home`}
          className="group -my-2 inline-flex items-center justify-self-start md:col-span-3"
        >
          {/* Hand-lettered logo (public/brand/manoj-logo.png, transparent) */}
          <Image
            src="/brand/manoj-logo.png"
            alt=""
            width={505}
            height={221}
            preload
            className="h-[34px] w-auto transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] motion-safe:group-hover:-rotate-2 md:h-[38px]"
          />
        </Link>

        <ul className="hidden justify-center gap-8 md:col-span-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.href} data-anim="nav">
              {/* Plain anchors to home-page sections, like "Let's talk" below */}
              <a href={link.href} className="group">
                <RollingText>{link.label}</RollingText>
              </a>
            </li>
          ))}
        </ul>

        {/* Plain anchor: from other pages a full load lets the home page size
            its sections before the browser scrolls to #contact. */}
        {/* A button in the same style as "Download résumé" */}
        <a
          href={contactLink.href}
          data-anim="nav"
          className="group hidden items-center gap-2 justify-self-end rounded-[3px] border border-accent bg-accent px-4 py-2.5 text-white transition-colors duration-500 hover:bg-transparent hover:text-accent md:col-span-3 md:inline-flex"
        >
          <RollingText>{contactLink.label}</RollingText>
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
          >
            ↗
          </span>
        </a>

        <div className="justify-self-end md:hidden">
          <MobileMenu links={navLinks} contact={contactLink} />
        </div>
      </nav>
    </HeaderShell>
  );
}

// Holds the fixed header's place in the page flow, so content below starts
// where it did when the header was in the flow.
export function HeaderSpace() {
  return <div aria-hidden="true" className={ROW} />;
}
