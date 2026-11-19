// UI Snip — from visual inspiration to AI-ready implementation.
//
// Manoj's own product: a Chrome extension he designed and built himself, with
// Claude Code as his AI pair programmer. Sources: his case-study brief
// (UI_Snip_Portfolio_Case_Study.pdf), his real panel screenshots (v0.1.0) and
// the project's own notes (its CLAUDE.md files). Nothing here claims user
// research, users or metrics: v0.1.0 is in a limited beta on the Chrome Web
// Store, as UI Snip Beta (November 2026), and its store link is public. Never
// publish the backend's address, beta access codes or the development
// build's extension ID here.
//
// Screens are the real side panel (1×), cropped by a few pixels so each row
// shares one size. The workflow tiles are the panel's own feature art on
// Night. Colours are UI Snip's tokens (src/panel/theme.css in the extension).

const dir = "/images/projects/ui-snip/case-study";
// The real panel screenshots on the project's violet (also its Selected Work
// slides), 1600 × 1000.
const panels = "/images/projects/ui-snip";

// An image at its real exported size, so nothing is cropped or stretched.
// A path starting with "/" is used as is (the panel screenshots).
const shot = (path, width, height, label, alt, extra = {}) => ({
  src: path.startsWith("/") ? path : `${dir}/${path}`,
  width,
  height,
  label,
  alt,
  quality: 90,
  ...extra,
});

const uiSnip = {
  // A light Mist page; Night stages carry the always-dark panel, and the
  // panel's violet is the accent.
  theme: {
    background: "#F5F1FD",
    text: "#1A0F2B",
    line: "#DDD1F2",
    surface: "#1A0F2B",
    accent: "#6832FC",
    stage: "#1A0F2B",
    stageText: "#F3ECFF",
  },
  navLabels: { strategy: "Approach", system: "Visual design", outcome: "Learnings" },

  // ------------------------------------------------------------------ Hero
  category: "Chrome Extension · AI Developer Tool",
  summary: "From visual inspiration to AI-ready implementation.",
  subheadline:
    "A Chrome extension that turns any design, motion or animation on the web into a structured prompt for AI coding tools. Designed and built by me, end to end.",
  // The store listing, as a button under the summary (components/case-study/
  // CaseHero). In the beta, AI features ask for an access code.
  heroLink: {
    label: "Get it on the Chrome Web Store",
    href: "https://chromewebstore.google.com/detail/ui-snip-beta/fmeenkmihdichlkaajkknhoplmcojaoj",
    note: "Limited beta · v0.1.0",
  },
  // Professional context (components/case-study/CaseStudyMeta).
  context: {
    zeroToOne: true,
    role: "Product Designer & Developer",
    team: "Solo, with Claude Code as my AI pair programmer",
    product: "Independent product: a Chrome extension with a small AI backend",
    status: "v0.1.0 · limited beta on the Chrome Web Store",
    timeline: "Oct – Nov 2026",
    platforms: "Chrome side panel · Cloudflare Workers · Google Gemini",
    ownership: [
      "Product strategy",
      "UX & UI design (Figma)",
      "Interaction design",
      "Front-end (React, TypeScript)",
      "AI prompts & guardrails",
      "Privacy & safety",
      "Testing",
    ],
  },
  tldr: {
    decisions: [
      "Label what's measured, and what's guessed.",
      "Let AI add to the prompt, never overwrite it.",
      "Make every send a conscious choice.",
    ],
    result: [
      "A working v0.1.0: all three workflows tested end to end in Chrome on real sites.",
      "Now in a limited beta on the Chrome Web Store.",
    ],
  },
  // The demo (1:00, with sound): UI Snip running all three workflows on a
  // real site, ending on its title card, which is also the poster. Encoded
  // from the 4K original at 2560 × 1160 (H.264, AAC, fast start), 7.6 MB.
  // Nothing loads until Play. To replace it, give the new file a new name.
  heroVideo: {
    src: "/videos/ui-snip-demo.mp4",
    width: 2560,
    height: 1160,
    title: "UI Snip demo video",
    duration: "1:00",
    caption: "Capture Motion, Select Design and Inspect Animation on a live site, each ending in an AI-ready prompt.",
    poster: { src: `${dir}/hero/demo-poster.webp` },
  },

  labels: {
    challenge: "The problem",
    decisions: "Key decisions",
    designSystem: "Visual design",
    tradeoffs: "Trade-offs",
    validation: "Testing",
  },
  headings: {
    approach: "Observe. Capture. Understand. Recreate.",
    decisions: "Designing an AI tool people can trust.",
    designSystem: "A focused tool with a distinct identity.",
    tradeoffs: "What the browser allowed, and what I chose.",
    validation: "How it was tested.",
  },

  // --------------------------------------------------------------- Problem
  challenge: {
    statement: "The gap between seeing and building.",
    body: "AI coding tools build what you can describe. But a screenshot loses the layout, type and colour behind a design, “smooth” carries no timing, and most AI tools can't watch a recording.",
    hmwLabel: "Design challenge",
    hmw: "How might we turn what someone sees on a website into context an AI coding tool can build from, without pretending every detail can be measured?",
    problems: [
      { title: "Scattered references", text: "Screenshots, recordings and notes live apart." },
      { title: "Lost detail", text: "A picture shows the look, not the layout, type and spacing behind it." },
      { title: "Motion is hard to describe", text: "Timing, easing and order are the first things lost." },
      { title: "Guesses that look like facts", text: "Nothing shows which values were measured and which were guessed." },
    ],
    users: {
      title: "Designed for people who build from references.",
      groups: [
        { title: "UI/UX designers", text: "Hand a reference to AI or developers, details intact." },
        { title: "Frontend developers", text: "Start from real values, not an eyeballed screenshot." },
        { title: "AI-assisted builders", text: "Paste a structured prompt into Claude Code, Cursor or Codex." },
      ],
    },
  },

  // -------------------------------------------------------------- Approach
  approach: {
    body: "Three workflows, three kinds of evidence (how it looks, how it moves, what the browser reports), all in the same four steps.",
    layout: "flow",
    principles: [
      { title: "Discover", text: "Notice a UI or motion detail worth recreating." },
      { title: "Capture", text: "Select an element, a section or an area of the page." },
      { title: "Review", text: "Check the frames and the facts, each labelled by how it was found." },
      { title: "Recreate", text: "Copy a prompt, for React or HTML/CSS, into an AI coding tool." },
    ],
    // The panel itself, one tab per workflow, rather than illustrations.
    media: {
      layout: "full",
      caption: "Select Design · Capture Motion · Inspect Animation: how it looks, how it moves, what the browser reports.",
      image: shot(
        `${panels}/workflows.webp`,
        1600,
        1000,
        "UI Snip · three workflows",
        "UI Snip's side panel three times on its violet background: the Select Design, Capture Motion and Inspect Animation tabs, each asking “What do you want to capture?”",
      ),
    },
  },

  // ------------------------------------------------------------- Decisions
  decisions: [
    {
      title: "Label what's measured, and what's guessed.",
      problem: "An AI tool treats every number as true, so a guessed value next to a real one can't be told apart.",
      decision: "Every fact carries one of four labels, in the panel and in the prompt; when UI Snip can't tell, it says so.",
      why: "A label tells the AI what it may change, and the person what to double-check.",
      principlesLabel: "Four labels",
      principles: [
        { title: "Observed", text: "Read straight from the browser." },
        { title: "Measured", text: "Sampled over time, frame by frame." },
        { title: "Estimated", text: "Inferred, including everything AI reads from frames." },
        { title: "Recommended", text: "A suggestion, from a template or from AI." },
      ],
      // The real panel: Select Design's Observed screenshot and Inspect
      // Animation's Measured motion with an Estimated trigger (1600 × 1000).
      media: {
        layout: "annotated",
        caption: "Observed · Measured · Estimated, side by side in the panel.",
        image: shot(
          `${panels}/design-and-inspect.webp`,
          1600,
          1000,
          "Labels in the panel",
          "Select Design's chosen element with its Observed screenshot and design facts, beside Inspect Animation's Measured motion: type not reported by Chrome, a click trigger labelled Estimated, about 100 ms and the change measured",
        ),
        markerTone: "light", // on the panel's dark violet
        panFocus: 0.31,
        markers: [
          { n: 1, box: [270, 182, 712, 612] },
          { n: 2, box: [880, 126, 1308, 224] },
          { n: 3, box: [884, 278, 1300, 342] },
        ],
        notes: [
          "Observed: read straight from the browser, like the element's screenshot and its design facts.",
          "Measured: sampled over time, such as position, size and opacity as the element changes.",
          "Estimated: inferred, like this likely click trigger, so the AI knows it may change it and the reader knows to double-check.",
        ],
      },
      impact: "Exact values stay exact; estimates are clearly estimates.",
    },
    {
      title: "Turn motion into frames an AI can read.",
      problem: "Motion is the hardest part of a reference to describe, and most AI coding tools can't watch a video.",
      decision: "Record up to five seconds of an area as about 20 timestamped frames, fold them into keyframes, and send one storyboard image.",
      why: "People and AI can both read a storyboard, whatever made the motion: video, GIF, CSS or JavaScript.",
      media: {
        layout: "sequence",
        arrows: true,
        caption: "Capture → Keyframes → Storyboard → Prompt",
        images: [
          shot(
            "decisions/motion-frames.webp",
            494,
            793,
            "Capture Motion · Frames",
            "Capture Motion's timeline: frame 1 of 20 at 0.00 s, labelled Measured, with thumbnails, 12 keyframes from 20 captured frames, a note on what's sent to Google's Gemini, and Generate prompt",
            { title: "Review the frames", caption: "20 captured frames fold into 12 keyframes." },
          ),
          shot(
            "decisions/motion-ai-writing.webp",
            494,
            793,
            "Capture Motion · Writing",
            "The prompt screen while the AI writes: “The AI is looking at your frames…”, a React or HTML/CSS switch, Writing… and Cancel",
            { title: "The AI reads the storyboard", caption: "The answer streams in, and Cancel stops it." },
          ),
          shot(
            "decisions/motion-prompt.webp",
            494,
            793,
            "Capture Motion · Prompt",
            "The finished prompt: 5,130 characters written by AI from the storyboard, noting that what it says about the motion is Estimated, with Copy prompt and Copy storyboard",
            { title: "Copy the prompt", caption: "For React or HTML/CSS, and labelled as written by AI." },
          ),
        ],
      },
      impact: "Five seconds of motion becomes a storyboard and a prompt you can hand over.",
    },
    {
      title: "Let AI add to the prompt, never overwrite it.",
      problem: "Sending every capture to AI is slow and quota-bound, and a rewrite can quietly change an exact value.",
      decision: "Build every prompt on the device first; AI adds its own section and never edits it. For motion, a local fallback stands in if AI fails.",
      why: "AI should improve the result, not become a single point of failure.",
      principlesLabel: "The AI's rules",
      principles: [
        { title: "Adds, never replaces", text: "Its part sits below the unchanged local prompt." },
        { title: "Doesn't restate values", text: "Any number it adds that the evidence lacks is flagged." },
        { title: "Says what it is", text: "Its headings mark what's Estimated or Recommended." },
      ],
      impact: "There's always a prompt to copy, with or without AI.",
    },
    {
      title: "Make every send a conscious choice.",
      problem: "A screenshot can show anything, people at Google may read what's sent on Gemini's free tier, and the answer lands in a tool that can run commands.",
      decision: "Nothing runs until you choose a workflow, nothing leaves without a click, and every AI button says what's sent and who may see it.",
      why: "Consent means knowing what you share before you share it.",
      principlesLabel: "Privacy and safety, by design",
      principles: [
        { title: "Say what's sent, every time", text: "The notice sits beside every AI button." },
        { title: "No page words in prompts", text: "Text is described, never copied: “h2, 1 line, 38 characters”." },
        { title: "Treat the page as untrusted", text: "Hidden instructions are ignored; links and commands are flagged." },
      ],
      // The real panel: the notice above Generate prompt, then the result.
      media: {
        layout: "annotated",
        caption: "The notice sits beside the button, before anything is sent.",
        image: shot(
          `${panels}/capture-motion.webp`,
          1600,
          1000,
          "Capture Motion · consent",
          "Capture Motion's frames with the note “This sends the storyboard to Google's Gemini. Google may use it to improve its products, and people at Google may read it. Use public pages only.” above Generate prompt, beside the AI-written prompt marked as written by AI, with what it says about the motion Estimated",
        ),
        markerTone: "light",
        panFocus: 0.32,
        markers: [
          { n: 1, box: [276, 618, 742, 832] },
          { n: 2, box: [880, 578, 1302, 664] },
        ],
        notes: [
          "Before anything is sent, the line above the button says what goes to Google's Gemini, that people at Google may read it, and to use public pages only.",
          "The finished prompt says it was written by AI from the storyboard, and that what it says about the motion is Estimated.",
        ],
      },
      impact: "Every AI request is a choice; a private page still gets a local prompt.",
    },
  ],

  // --------------------------------------------------------- Visual design
  designSystem: {
    statement: "Polished, minimal and calm, with no cluttered DevTools look.",
    body: "Designed in Figma from the home screen out, so the whole panel reads as one product.",
    platforms: [
      { name: "One clear next step", detail: "One main action per screen; the rest move into More." },
      { name: "Precise review", detail: "Frames get a scrubber, thumbnails and timestamps, and keyboard control." },
      { name: "Honest system feedback", detail: "Every state is explicit, and warnings stay in view." },
    ],
    visualLanguage: {
      title: "Night, violet and glass.",
      body: "Always dark, so it never borrows from the page it reads. Saturated violet is kept for the next action.",
      colors: [
        {
          hex: "#1A0F2B",
          name: "Night",
          token: "--color-neutral-950",
          rationale: "The panel's base, and the solid strip behind the actions, so a long screen never shows through them.",
        },
        {
          palette: ["#6832FC", "#A565FA"],
          name: "Violet gradient",
          token: "--snip-fill",
          rationale: "The main action and the active tab: the one thing to do next.",
        },
        {
          palette: ["#D1BBEB", "#BF9AED"],
          name: "Lilac & Orchid",
          token: "--color-snip-lilac · --color-snip-orchid",
          rationale: "Secondary text (the page's name, descriptions, the version) and gradient text that fades into white.",
        },
        {
          hex: "#FFFBFE",
          name: "Snip White",
          token: "--color-snip-white",
          rationale: "Primary text and labels, with high contrast on Night.",
        },
      ],
      specs: [
        {
          name: "Typography",
          value: "Montserrat, bundled",
          rationale: "Shipped inside the extension, so the panel fetches nothing from the internet.",
        },
        {
          name: "Scale",
          value: "The Figma design at 75%",
          rationale: "At full size it looked too big beside a real page. At 75%, the wordmark matches a site's logo and the panel reads as secondary.",
        },
        {
          name: "Side panel, not popup",
          value: "Docked beside the page",
          rationale: "A popup closes as soon as the page is clicked, which would end selecting and capturing.",
        },
        {
          name: "Surfaces",
          value: "Glass cards on a grainy gradient",
          rationale: "Black at 40% with a 12 px blur, so the panel's background glows through.",
        },
        {
          name: "Motion",
          value: "200 ms view transitions",
          rationale: "The tab pill slides between workflows, and reduced-motion preferences are respected.",
        },
      ],
    },
  },

  // ------------------------------------------------------------ Trade-offs
  tradeoffs: {
    items: [
      {
        title: "The visible page, not a stitched full page",
        text: "Scrolling to stitch would trigger the site's own animations and lazy loading.",
      },
      {
        title: "Five seconds, about four frames a second",
        text: "A change shorter than 250 ms can be missed; denser frames are next.",
      },
      {
        title: "A permission only when it's needed",
        text: "Tab capture is requested on first use of Capture Motion, so Select Design never shows its warning.",
      },
      {
        title: "AI on a free tier, with guardrails",
        text: "Rate limits, a daily cap, region checks and beta access codes.",
      },
    ],
  },

  // --------------------------------------------------------------- Testing
  validation: {
    status: "A working v0.1.0, not yet tested with users beyond me.",
    body: [
      "All three workflows tested end to end in Chrome on real sites, plus automated checks against test pages whose true values are known.",
      "The AI was read by hand across 50+ real Gemini calls; on a hostile page written to trick it, none of the 9 answers repeated the planted text.",
    ],
    nextLabel: "Next",
    next: "A limited beta with trusted testers, now on the Chrome Web Store, then a paid AI tier before anyone else relies on it.",
  },

  // ------------------------------------------------------------ Reflection
  reflection: {
    body: [
      "Designing an AI product is mostly deciding what the AI shouldn't do: what it may not change, what it must label, and what happens when it fails.",
      "Building it myself meant every decision met the real browser immediately, and the honest answer was often a clearer label, not a cleverer feature.",
    ],
    next: [
      "Run the beta, and learn which workflow people come back to.",
      "Longer captures and denser frames for Capture Motion.",
      "A paid AI tier, then a full release beyond the beta.",
    ],
  },
};

export default uiSnip;
