// Single source of truth for project content and art direction.
//
// Visuals: export each image at 1600 × 1000 (16:10) as WebP and place it at
// the listed path. The first visual is the project's lead image; the other
// two are supporting views. Until a file exists, a neutral placeholder of the
// same proportions is rendered instead — no code changes needed either way.
//
// `tag` is the Selected Work eyebrow: what kind of product, whether it was
// 0→1 (built from scratch, not a redesign) and what Manoj did.
//
// Colours: `background` and `foreground` drive the Selected Work stage while
// the project is in focus; `accent` colours its title and indicator.

export const visualSize = { width: 1600, height: 1000 };

export const projects = [
  {
    id: "cetasika",
    number: "01",
    title: "Cetasika",
    subtitle: "Healthcare & Wellness Ecosystem",
    tag: "0→1 Healthcare Ecosystem · Product Design",
    description:
      "Designing a connected healthcare and wellness experience across consumer applications, CMS and web.",
    href: "/work/cetasika",
    cta: "View case study",
    // Cetasika design-system teals: Primary Teal glow top-right, deepening
    // to the brand teal and a darker shade under the text.
    background: "#115c61",
    gradient: "radial-gradient(90% 110% at 85% 10%, rgb(31 163 172 / 0.55), transparent 60%), linear-gradient(235deg, #1FA3AC 0%, #115C61 50%, #0A3D41 100%)",
    foreground: "#e6f4fd",
    accent: "#e6f4fd",
    visuals: [
      {
        src: "/images/projects/cetasika/app-screens.webp",
        label: "App screens",
        alt: "Cetasika consumer app screens",
      },
      {
        src: "/images/projects/cetasika/cms-dashboard.webp",
        label: "CMS dashboard",
        alt: "Cetasika CMS dashboard",
      },
      {
        src: "/images/projects/cetasika/consumer-app.webp",
        label: "Consumer app",
        alt: "Cetasika consumer app home screen with wellness services",
      },
    ],
  },
  {
    id: "datalyon",
    number: "02",
    title: "Datalyon",
    subtitle: "AI-Powered Data Analytics",
    tag: "0→1 AI Analytics Product · Product Design",
    description:
      "Designing an AI-powered analytics experience that takes people from raw data to real insights.",
    href: "/work/datalyon",
    cta: "View case study",
    // Datalyon Figma purples: Primary/500 glow top-right, Primary/700, and
    // the brand charcoal (Primary 09) under the text.
    background: "#5D356E",
    gradient: "radial-gradient(90% 110% at 85% 10%, rgb(155 113 176 / 0.5), transparent 60%), linear-gradient(235deg, #844C9D 0%, #5D356E 50%, #41363F 100%)",
    foreground: "#ffffff",
    accent: "#ffffff",
    visuals: [
      {
        src: "/images/projects/datalyon/assistant.webp",
        label: "AI Assistant",
        alt: "Datalyon on a desktop monitor in a lilac room: the AI Assistant beside a Sales Performance dashboard, answering why sales dropped last week",
      },
      {
        src: "/images/projects/datalyon/dashboard.webp",
        label: "Dashboard",
        alt: "An AI-generated Sales Performance dashboard with KPI cards, charts and See AI Insight links",
      },
      {
        src: "/images/projects/datalyon/data-profile.webp",
        label: "Data profile",
        alt: "Data Profile: a warning that 2 of 12 columns need attention, quality metrics and a column table",
      },
    ],
  },
  {
    id: "1ev",
    number: "03",
    title: "1EV",
    subtitle: "EV Charging Platform",
    tag: "EV Mobility Platform · End-to-End UX",
    description:
      "Designing an end-to-end EV charging experience covering discovery, booking, payments and live charging.",
    href: "/work/1ev",
    cta: "View case study",
    // The 1EV app background: Figma "Gradient (Used in UI)", teal to navy.
    // `background` is its navy end, used while colours cross-fade.
    background: "#090F2F",
    gradient: "linear-gradient(125deg, #053A42 0%, #090F2F 100%)",
    foreground: "#E6F4F7",
    accent: "#ffffff",
    visuals: [
      {
        src: "/images/projects/1ev/charger-discovery.webp",
        label: "Charger discovery",
        alt: "Three phones showing 1EV on a deep teal background: the wallet with Evoins, a charging station's details with Check In, and the charger map",
      },
      {
        src: "/images/projects/1ev/station-details.webp",
        label: "Slot booking",
        alt: "1EV Slot Booking with charging type, estimate and Booking Preview, beside the Booking Successful summary",
      },
      {
        src: "/images/projects/1ev/charging-session.webp",
        label: "Charging session",
        alt: "A live 1EV charging session at 68%, between a charging-interrupted screen with Try Again and the completed session details",
      },
    ],
  },
  {
    id: "other-works",
    number: "04",
    title: "Other Works",
    subtitle: "ViewDent · Meta-flow.ai",
    tag: "Dental & Enterprise Automation · Product UX",
    description:
      "Two shorter showcases: guided AI smile visualization in dental care, and enterprise workflow automation.",
    href: "/work/other-works",
    cta: "View projects",
    // Between ViewDent's blue and Meta-flow's deep blue: a lighter glow
    // top-right, deepening to navy under the text.
    background: "#163F86",
    gradient: "radial-gradient(90% 110% at 85% 10%, rgb(74 130 220 / 0.5), transparent 60%), linear-gradient(235deg, #2D5FC8 0%, #163F86 50%, #0B2348 100%)",
    foreground: "#ffffff",
    accent: "#ffffff",
    visuals: [
      {
        src: "/images/projects/other-works/viewdent-capture.webp",
        label: "ViewDent",
        alt: "ViewDent's AI smile capture: a smiling face in the alignment guide with live status chips",
      },
      {
        src: "/images/projects/other-works/metaflow-dashboard.webp",
        label: "Meta-flow.ai",
        alt: "The meta-flow.ai dashboard on a desktop monitor",
      },
      {
        src: "/images/projects/other-works/viewdent-compare.webp",
        label: "ViewDent comparison",
        alt: "ViewDent's before and after smile comparison",
      },
    ],
  },
];
