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

// An image at its real exported size, so nothing is cropped or stretched.
const shot = (path, width, height, label, alt, extra = {}) => ({
  src: `${dir}/${path}`,
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
    "A Chrome extension that captures a design, a motion or an animation on any website and turns it into a structured prompt for AI coding tools like Claude Code, Cursor and Codex. I designed and built it end to end.",
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
    caption:
      "UI Snip on a live site: Capture Motion, Select Design and Inspect Animation, each ending in a prompt for an AI coding tool.",
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
    body: [
      "Design inspiration lives across websites, videos and motion-heavy interfaces. Recreating it means switching tools, capturing references, interpreting timing and explaining visual behaviour by hand.",
      "AI coding tools can build almost anything you can describe. But a screenshot loses the layout, type and colour behind a design, words like “smooth” or “bouncy” carry no timing, and most AI coding tools can't watch a screen recording at all.",
    ],
    hmwLabel: "Design challenge",
    hmw: "How might we turn what someone sees on a website into context an AI coding tool can build from, without pretending every detail can be measured?",
    problems: [
      {
        title: "Scattered references",
        text: "Screenshots and screen recordings sit apart from element details, animation observations and implementation instructions.",
      },
      {
        title: "Lost detail",
        text: "A picture shows how something looks, not the layout, type, colour and spacing behind it.",
      },
      {
        title: "Motion is hard to put into words",
        text: "Timing, easing and order make an interaction feel right, and they're the first things lost in a description.",
      },
      {
        title: "Guesses that look like facts",
        text: "AI fills every gap with confidence. Nothing tells you which values were measured and which were guessed.",
      },
    ],
    users: {
      title: "Designed for people who build from references.",
      groups: [
        {
          title: "UI/UX designers",
          text: "Collect a reference and hand it to AI, or to developers, with its details intact.",
        },
        {
          title: "Frontend developers",
          text: "Start from real values (type, spacing, timing, keyframes) instead of eyeballing a screenshot.",
        },
        {
          title: "AI-assisted builders",
          text: "Paste a structured prompt and a storyboard into Claude Code, Cursor or Codex instead of describing a screen from memory.",
        },
      ],
    },
  },

  // -------------------------------------------------------------- Approach
  approach: {
    body: "UI Snip has three workflows, each collecting a different kind of evidence: what something looks like, how it moves, and what the browser itself reports. All three follow the same four steps, so it feels like one tool, not three.",
    layout: "flow",
    principles: [
      { title: "Discover", text: "Notice a UI or motion detail worth recreating." },
      { title: "Capture", text: "Select an element, a section or an area of the page." },
      { title: "Review", text: "Check the frames and the facts, each labelled by how it was found." },
      { title: "Recreate", text: "Copy a prompt, for React or HTML/CSS, into an AI coding tool." },
    ],
    media: {
      layout: "three-up",
      caption: "Three ways to capture an idea: appearance, motion frames, or behaviour the browser reports.",
      images: [
        shot(
          "workflows/select-design.webp",
          960,
          720,
          "Select Design",
          "UI Snip's Select Design artwork: a dashed selection frame around a web page, with a pointer",
          {
            caption:
              "Select Design: a button, a section or the visible page, as a screenshot plus the design facts behind it: layout, type, colour and spacing.",
          },
        ),
        shot(
          "workflows/capture-motion.webp",
          960,
          720,
          "Capture Motion",
          "UI Snip's Capture Motion artwork: a stack of film frames with a play button and a 5-second recording badge",
          {
            caption:
              "Capture Motion: up to five seconds of any animation, video or GIF, as timestamped frames and a storyboard.",
          },
        ),
        shot(
          "workflows/inspect-animation.webp",
          960,
          720,
          "Inspect Animation",
          "UI Snip's Inspect Animation artwork: an easing curve beside a panel of sliders",
          {
            caption:
              "Inspect Animation: what Chrome itself reports about an element's animation (timing, easing, keyframes) and how the element changed.",
          },
        ),
      ],
    },
  },

  // ------------------------------------------------------------- Decisions
  decisions: [
    {
      title: "Label what's measured, and what's guessed.",
      problem:
        "An AI coding tool treats every number in a prompt as true. If a real transition time sits next to a guessed one, neither the AI nor the person reading can tell which to trust.",
      decision: [
        "Every fact carries one of four labels, in the panel and in the prompt.",
        "When UI Snip can't tell, it says so: “Not reported by Chrome”, or “No animation detected” rather than “no animation exists”.",
      ],
      why: "Trust comes from being honest about uncertainty. A label tells the AI what it may change, and tells the person what to double-check.",
      principlesLabel: "Four labels",
      principles: [
        {
          title: "Observed",
          text: "Read straight from the browser: computed styles, Chrome's animation timing, easing and keyframes, the page's structure.",
        },
        {
          title: "Measured",
          text: "Sampled over time: position, size and opacity as they change, and each captured frame's time.",
        },
        {
          title: "Estimated",
          text: "Inferred: a likely trigger, an easing fit, and everything an AI reads from frames.",
        },
        {
          title: "Recommended",
          text: "A suggestion, such as a library or an approach, whether from a template or from AI.",
        },
      ],
      impact: "Exact values stay exact, and estimates are clearly estimates.",
    },
    {
      title: "Turn motion into frames an AI can read.",
      problem:
        "Motion is the hardest part of a reference to describe, and most AI coding tools can't watch a video.",
      decision: [
        "Draw a box over the animation and start the capture: a three-second countdown leaves time to press play on the page, then UI Snip records up to five seconds of that area from the tab's own picture. That's about 20 cropped, timestamped frames, never a video file.",
        "Frames that look the same fold into keyframes, and a timeline with a scrubber, thumbnails and timestamps lets you check them. The storyboard (one image of the frames in order, with their times) goes to the AI, or into your own tool.",
      ],
      why: "A storyboard is something both people and AI can read. Because it's taken from what Chrome draws, it works for video, GIFs, CSS and JavaScript animation alike.",
      media: {
        layout: "sequence",
        arrows: true,
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
      impact: "Motion becomes something you can hand over: a storyboard and a prompt, from five seconds of capture.",
    },
    {
      title: "Let AI add to the prompt, never overwrite it.",
      problem:
        "Sending every capture to AI makes each prompt slow and dependent on a daily quota. Worse, an AI rewrite can quietly change an exact value.",
      decision: [
        "Every workflow builds its prompt on the device first: instant, free and private. “Enhance with AI” then adds its own part to that prompt, which stays word for word.",
        "Capture Motion is the exception, because frames are pictures: there the AI writes the prompt. If it fails or reaches its limit, a local prompt takes its place and asks your coding tool to read the attached storyboard.",
      ],
      why: "AI should improve the result, not become a single point of failure. And it should never be able to change a value the browser reported.",
      principlesLabel: "The AI's rules",
      principles: [
        {
          title: "Adds, never replaces",
          text: "Its part is headed “from AI”, below the unchanged local prompt.",
        },
        {
          title: "Doesn't restate values",
          text: "It's told never to repeat a number, and any value it writes that the evidence doesn't have is flagged.",
        },
        {
          title: "Says what it is",
          text: "Its own headings say what's Estimated and what's Recommended.",
        },
      ],
      impact: "There's always a prompt to copy, whether or not the AI is available.",
    },
    {
      title: "Make every send a conscious choice.",
      problem:
        "A screenshot can show anything on a page. Gemini's free tier lets people at Google read what's sent. And the AI's answer gets pasted into a tool that can run commands.",
      decision:
        "Nothing runs on a page until you choose a workflow, and nothing leaves the device without a click. The line beside every AI button says what's sent and who may see it, before it's sent.",
      why: "Consent means knowing what you're sharing before you share it.",
      principlesLabel: "Privacy and safety, by design",
      principles: [
        {
          title: "Say what's sent, every time",
          text: "“This sends the storyboard to Google's Gemini. Google may use it to improve its products, and people at Google may read it. Use public pages only.”",
        },
        {
          title: "No page words in prompts",
          text: "Text is described by what it's for and how long it is (“h2, 1 line, 38 characters”), never copied. No page address, no form values, no cookies.",
        },
        {
          title: "Treat the page as untrusted",
          text: "A page can hide text aimed at the AI. The AI treats pictures as data, answers show only as text, and a web address or command in an answer is flagged before you paste it.",
        },
      ],
      impact: "Every AI request is a choice, and a private page still gets a local prompt.",
    },
  ],

  // --------------------------------------------------------- Visual design
  designSystem: {
    statement: "Polished, minimal and calm, with no cluttered DevTools look.",
    body: "The look started in Figma with the home screen. Every other screen takes its colours, type and surfaces, so the whole panel reads as one product.",
    platforms: [
      {
        name: "One clear next step",
        detail:
          "Every screen has one main action. Secondary actions sit beside it and the rest move into More, so nothing is lost and nothing competes.",
      },
      {
        name: "Precise review",
        detail: "Frames get a scrubber, a selected state, thumbnails and timestamps, and work from the keyboard too.",
      },
      {
        name: "Honest system feedback",
        detail:
          "Ready, selecting, capturing, measuring and AI states are always explicit, and warnings stay in view rather than behind a disclosure.",
      },
    ],
    visualLanguage: {
      title: "Night, violet and glass.",
      body: [
        "UI Snip sits beside every kind of website, so it has one look, always dark, that never borrows from the page it's reading.",
        "Saturated violet is kept for the next action. Everything else stays in quiet lilacs on Night.",
      ],
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
        text: "Scrolling to capture a whole page would trigger the site's own scroll animations and lazy loading, and repeat sticky headers. So Full page means the visible part, clearly labelled.",
      },
      {
        title: "Five seconds, about four frames a second",
        text: "Chrome only sends a new picture when the tab changes, so a change shorter than the 250 ms between frames can be missed. Longer captures and denser frames are next.",
      },
      {
        title: "A permission only when it's needed",
        text: "Capture Motion needs Chrome's tab capture, whose warning reads “Read and change all your data on all websites”. It's requested the first time Capture Motion is used, at the cost of a one-time restart, so Select Design never shows that warning.",
      },
      {
        title: "AI on a free tier, with guardrails",
        text: "With no paid services yet, requests are rate-limited and capped per day, regions where Gemini's free tier isn't allowed are refused, and beta testers need an access code.",
      },
    ],
  },

  // --------------------------------------------------------------- Testing
  validation: {
    status: "A working v0.1.0, not yet tested with users beyond me.",
    body: [
      "I tested all three workflows end to end in Chrome on real sites. Each workflow also has automated checks that drive the real, built extension in Chrome against local test pages whose true values are known, so what UI Snip reports can be compared with what's really there.",
      "The AI was quality-tested with more than 50 real Gemini calls, read by hand. They included a hostile page with text written to trick the AI, and none of the 9 answers about it repeated that text.",
    ],
    nextLabel: "Next",
    next: "A limited beta with trusted testers, now on the Chrome Web Store, then a paid AI tier before anyone else relies on it.",
  },

  // ------------------------------------------------------------ Reflection
  reflection: {
    body: [
      "Designing an AI product is mostly deciding what the AI shouldn't do: what it may not change, what it must label, when it waits for a click, and what happens when it fails.",
      "Building UI Snip myself, with Claude Code as my pair programmer, changed how I design. Every decision met the real browser almost immediately, with its permissions, limits and timing, and the honest answer was often a clearer label rather than a cleverer feature.",
    ],
    next: [
      "Run the beta, and learn which workflow people come back to.",
      "Longer captures and denser frames for Capture Motion.",
      "A paid AI tier, then a full release beyond the beta.",
    ],
  },
};

export default uiSnip;
