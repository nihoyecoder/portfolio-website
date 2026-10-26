import Image from "next/image";
import Link from "next/link";
import { profileLinks } from "@/lib/config/contact";
import { contactLink, navLinks, site } from "@/lib/site";
import RollingText from "@/components/ui/RollingText";
import HeaderShell from "./HeaderShell";
import MobileMenu from "./MobileMenu";
import ArrowIcon from "@/components/ui/ArrowIcon";

// The nav row's height (logo, links, "Let's talk"); HeaderSpace reserves it.
const ROW = "h-5 md:h-[42px]";

// Editorial header, fixed to the top (HeaderShell hides it while scrolling
// down). On the home page (`intro`) the hero timeline staggers its
// `data-anim` items in.
export default function Header({ intro = false }) {
  return (
    <HeaderShell intro={intro}>
      <nav aria-label="Primary" className={`grid grid-cols-2 items-center gap-x-6 text-sm md:grid-cols-[1fr_auto_1fr] ${ROW}`}>
        <Link
          href="/"
          data-anim="nav"
          aria-label={`${site.name}, home`}
          className="group -my-2 inline-flex items-center justify-self-start"
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

        <ul className="hidden justify-center gap-5 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <li key={link.href} data-anim="nav">
              {/* Plain anchors to home-page sections, like "Let's talk" below */}
              <a href={link.href} className="group">
                <RollingText>{link.label}</RollingText>
              </a>
            </li>
          ))}
          {/* Résumé and LinkedIn open in a new tab. */}
          {profileLinks.map((link) => (
            <li key={link.label} data-anim="nav">
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1">
                <RollingText>{link.label}</RollingText>
                <span
                  aria-hidden="true"
                  className="flex text-[0.85em] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                >
                  <ArrowIcon />
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Plain anchor: from other pages a full load lets the home page size
            its sections before the browser scrolls to #contact. */}
        {/* A button in the same style as "Download Resume" */}
        <a
          href={contactLink.href}
          data-anim="nav"
          className="group hidden items-center gap-2 justify-self-end rounded-[3px] border border-accent-strong bg-accent-strong px-4 py-2.5 text-white transition-colors duration-500 hover:bg-transparent hover:text-accent-strong md:inline-flex"
        >
          <RollingText>{contactLink.label}</RollingText>
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
          >
            <ArrowIcon />
          </span>
        </a>

        <div className="justify-self-end md:hidden">
          <MobileMenu links={navLinks} external={profileLinks} contact={contactLink} />
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
