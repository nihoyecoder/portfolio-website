// Datalyon — from raw data to real insights.
//
// A 0-to-1 product (not a redesign) designed by a team of two UX/UI
// designers at Meta For Data Technologies, so the copy says "we". Nothing here claims
// research, testing or metrics: the reasoning is design rationale, and the
// reflection ends on what still needs validating.
//
// Every screen is a real frame exported from the Datalyon Figma file
// (Datalyon-New-Design, page "Datalyon Light theme") at 2×:
//   AI Assistant + dashboard 1:17502 · data sources 1:12837 · sheet
//   selection 1:13492 · data profile 65:8596 · AI dashboard 1:26962 ·
//   chart editor 1:41111
// Colours come from that file's variables (names in `token`).
// Marker boxes are in each image's own pixels: [x1, y1, x2, y2].

const dir = "/images/projects/datalyon/case-study";

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

// Problem → what we did → why, in Datalyon's terms.
const labels = { problem: "The friction", decision: "What we did", why: "UX principle" };

const datalyon = {
  // Light page with a lilac tint; the brand charcoal frames the hero and
  // the section nav, and Datalyon purple is the accent.
  theme: {
    background: "#F6F4F8",
    text: "#231F20",
    line: "#E2DAE7",
    surface: "#41363F",
    accent: "#844C9D",
    stage: "#41363F",
    stageText: "#F9FAFB",
  },
  navLabels: { system: "Visual design", showcase: "Journey", outcome: "Reflection" },

  // ------------------------------------------------------------------ Hero
  category: "AI-Powered Data Analytics / Enterprise SaaS",
  summary: "From raw data to real insights.",
  subheadline:
    "Designing an AI-powered analytics experience that simplifies the journey from data connection to decision-making.",
  // Professional context (components/case-study/CaseStudyMeta). Designed by
  // two designers together, so no individual ownership list is claimed.
  context: {
    zeroToOne: true,
    company: "MFD (Meta For Data Technologies)",
    role: "UX/UI Designer",
    team: "Two UX/UI designers, co-designing the full journey",
    status: "Designed · not yet validated with users",
  },
  heroStage: true,
  hero: shot(
    "hero/ai-assistant.webp",
    3904,
    2160,
    "Datalyon · AI Assistant",
    "Datalyon's AI Assistant open beside a Sales Performance dashboard. Asked why sales dropped last week, it answers that sales fell 8.3%, mainly in the North region, correlating with a paused marketing campaign.",
  ),

  labels: {
    challenge: "The challenge",
    approach: "Design strategy",
    decisions: "Key UX decisions",
    designSystem: "Visual design",
    showcase: "Final experience",
    reflection: "Reflection",
  },
  headings: {
    approach: "Simplify the journey. Preserve the power.",
    decisions: "Designing for clarity at every step.",
    designSystem: "Color that communicates, not just decorates.",
    showcase: "One connected journey from data to understanding.",
    reflection: "Powerful tools don't have to feel complicated.",
  },

  // ------------------------------------------------------------- Challenge
  challenge: {
    statement: "Having data doesn't mean knowing what to do with it.",
    body: [
      "Turning raw data into actionable insights involves multiple decisions — choosing sources, understanding data quality, creating visualizations and interpreting results.",
      "For users unfamiliar with analytical workflows, these steps can create unnecessary complexity.",
    ],
    hmwLabel: "Design challenge",
    hmw: "How might we make the journey from raw data to actionable insights intuitive, guided and accessible?",
    note: "Datalyon was designed from scratch. The reasoning below is design rationale — it hasn't yet been validated with users.",
  },

  // -------------------------------------------------------------- Strategy
  approach: {
    body: "We structured the experience around four key decisions to help users progress with clarity while remaining in control.",
    layout: "flow",
    principles: [
      { title: "Connect", text: "Make data sources easy to recognize and select." },
      { title: "Understand", text: "Surface data quality issues before analysis." },
      { title: "Visualize", text: "Offer an AI-generated starting point for exploration." },
      { title: "Explore", text: "Let users investigate insights through natural language." },
    ],
  },

  // ------------------------------------------------------------- Decisions
  decisions: [
    {
      labels,
      title: "Make the first step obvious.",
      problem:
        "A first-time user's question is simply where their data lives — not how a connector is configured.",
      decision:
        "Rather than overwhelming users with technical configuration, we introduced recognizable data-source options and guided sheet selection.",
      why: "Recognition over recall, and progressive disclosure.",
      media: {
        layout: "annotated",
        caption: "Choose a source, then only the sheets you need.",
        image: shot(
          "decisions/data-source.webp",
          3904,
          1842,
          "Data source selection",
          "Choose your data sources: tabs for All data sources, Recent and Shared projects, a connector search, and a grid of sources such as Microsoft Excel, CSV, Snowflake, Google Drive, Salesforce and PostgreSQL, each with its type.",
        ),
        markers: [
          { n: 1, box: [645, 670, 3265, 1340] },
          { n: 2, box: [2495, 520, 3265, 620] },
        ],
        overlay: shot(
          "decisions/sheet-dialog.webp",
          1066,
          1080,
          "Sheet selection",
          "Select data to continue: a dialog listing four sheets from a Sales workbook with checkboxes, and a Continue button.",
          { marker: 3 },
        ),
        notes: [
          "Sources shown by logo, name and what they hold — recognized, not recalled.",
          "Search for a connector as the list grows.",
          "Next, a short dialog asks only which sheets to bring in.",
        ],
      },
    },
    {
      labels,
      title: "Build confidence before analysis.",
      problem: "Quality problems hidden in a file surface later, as charts that quietly mislead.",
      decision:
        "Data profiling makes hidden quality issues visible through clear metrics, column-level information and cleaning suggestions — helping users identify what needs attention before proceeding.",
      why: "Visibility of system status, and informed decision-making.",
      media: {
        layout: "annotated",
        image: shot(
          "decisions/data-profiling.webp",
          3840,
          2202,
          "Data profile",
          "Data Profile: a warning that 2 of 12 columns need attention, five quality metrics, a column table with one row flagged Need Attention, and Profile Complete with Skip & Proceed and Review Cleaning.",
        ),
        markers: [
          { n: 1, box: [330, 480, 3765, 660] },
          { n: 2, box: [330, 710, 3765, 1005] },
          { n: 3, box: [2990, 2015, 3700, 2160] },
        ],
        notes: [
          "The warning says what needs attention — 2 of 12 columns — and that everything else looks healthy.",
          "Quality at a glance: rows, duplicates, file size, columns and missing data.",
          "A clear next step: Review Cleaning, or Skip & Proceed.",
        ],
        details: [
          shot(
            "decisions/profiling-banner.webp",
            1950,
            200,
            "Attention banner",
            "Banner: 2 of 12 columns need your attention. Everything else looks healthy; fix the flagged columns now or continue and fix them later.",
            { wide: true, caption: "Up close: the warning leads with a count and a choice, not an error." },
          ),
          shot(
            "decisions/profiling-metrics.webp",
            1332,
            312,
            "Quality metrics",
            "Metric cards: Total Columns 12, Missing Data 0.01% — 7 cells across 60,000.",
            { caption: "Metrics in plain terms — “7 cells across 60,000”." },
          ),
          shot(
            "decisions/profiling-review.webp",
            710,
            148,
            "Next step",
            "Skip & Proceed and Review Cleaning buttons.",
            { caption: "Two explicit choices: review the suggested cleaning, or skip and proceed." },
          ),
        ],
      },
    },
    {
      labels,
      title: "Replace the blank canvas with momentum.",
      problem:
        "An empty dashboard asks people to know which chart answers which question before they've seen their data.",
      decision:
        "Instead of requiring users to configure every visualization from scratch, the experience presents an AI-generated dashboard with metrics, charts and suggested insights.",
      why: "Reduce initial effort while supporting exploration.",
      media: {
        layout: "annotated",
        caption: "An AI-generated starting point, not a finished answer.",
        image: shot(
          "decisions/ai-dashboard.webp",
          3904,
          2660,
          "AI-generated dashboard",
          "Sales Performance, an AI-generated dashboard: four KPI cards, a line chart, a pie chart, a bar chart and a donut chart, each with a short insight and a See AI Insight link.",
        ),
        markers: [
          { n: 1, box: [360, 465, 3755, 840] },
          { n: 2, box: [395, 935, 1450, 1120] },
          { n: 3, box: [2080, 885, 3755, 1700] },
        ],
        notes: [
          "KPI cards summarize the dataset first.",
          "Each chart carries a plain-language insight, with See AI Insight for more.",
          "Charts are a starting point — each card keeps its own edit, filter and remove controls.",
        ],
      },
    },
    {
      labels,
      title: "Let AI assist, not take over.",
      problem:
        "AI that only answers leaves people unable to shape the result; manual tools alone bring back the blank canvas.",
      decision:
        "Conversational AI lets users explore questions in natural language, while chart configuration controls keep the flexibility to refine and customize their dashboards.",
      why: "Human control and flexibility.",
      media: {
        layout: "split",
        images: [
          shot(
            "decisions/ai-chat.webp",
            2315,
            1710,
            "AI Assistant",
            "The AI Assistant panel: asked why sales dropped last week, it explains an 8.3% drop driven by the North region, beside the dashboard's charts, with suggested follow-up questions.",
            { title: "AI assists", caption: "Ask in plain language — “Why did sales drop last week?” — and get an explained answer." },
          ),
          shot(
            "decisions/chart-editor.webp",
            2315,
            1710,
            "Chart editor",
            "The Edit Chart panel beside the selected line chart: header and title, chart type (Line, Bar, Pie, Area), data mapping, aggregation and filters.",
            { title: "You stay in control", caption: "Refine any chart: type, data mapping, aggregation and filters." },
          ),
        ],
      },
    },
  ],

  // ---------------------------------------------------------- Visual design
  designSystem: {
    body: "Saturated colour is kept for meaning — action, attention, success and data — so the analytical surfaces stay calm and readable.",
    visualLanguage: {
      colors: [
        {
          hex: "#844C9D",
          name: "Purple",
          token: "Colors/Primary/500",
          rationale: "Brand recognition, primary actions, selected states and interactive emphasis.",
        },
        {
          hex: "#41363F",
          name: "Deep charcoal",
          token: "Primary 09",
          rationale: "Navigation and panel headers: structural contrast that anchors the screen.",
        },
        {
          palette: ["#FFFFFF", "#F9FAFB", "#D5DCE2"],
          name: "White & neutrals",
          token: "Background/Primary · Colors/Neutral/100 · /200",
          rationale: "Readable analytical surfaces with little visual noise.",
        },
        {
          hex: "#FFDB43",
          name: "Amber",
          token: "Colors/Yellow/100",
          rationale: "Data warnings and anything that needs attention.",
        },
        {
          hex: "#1FC16B",
          name: "Green",
          token: "Colors/Green/200",
          rationale: "Successful, healthy states, like a completed profile.",
        },
        {
          palette: ["#1D56DB", "#2695EC", "#52ABEF", "#D4EAFB"],
          name: "Chart palette",
          token: "Primary Color · Secondary Color 5 · 6 · 9",
          rationale: "Distinct steps for comparing series and categories.",
        },
      ],
    },
    media: [
      {
        layout: "two-up",
        images: [
          shot("color/assistant-header.webp", 960, 540, "Charcoal and purple", "AI Assistant header in charcoal, with the AI mode selected in purple beside Chart and Forecast.", {
            caption: "Charcoal anchors the panel; purple marks the selected mode.",
          }),
          shot("color/actions.webp", 960, 540, "Primary action", "Preview and Add Data as neutral buttons beside a purple Share Dashboard button.", {
            caption: "One purple primary action; secondary actions stay neutral.",
          }),
          shot("color/attention.webp", 960, 540, "Attention", "A table row for Customer ID with an amber edge and a Need Attention label.", {
            caption: "Amber flags a column that needs attention — with a label, not colour alone.",
          }),
          shot("color/complete.webp", 960, 540, "Success", "Profile Complete with a green check, 12 columns analysed, and 2 need attention in amber.", {
            caption: "Green confirms the profile is done; amber counts what's left.",
          }),
        ],
      },
    ],
    note: "Colour is never the only signal: warnings pair amber with an icon and plain language, and every status keeps its label. One thing to revisit — small amber text on white is low in contrast.",
  },

  // -------------------------------------------------------------- Journey
  showcase: {
    media: [
      {
        layout: "flow",
        images: [
          shot("journey/connect.webp", 1600, 1000, "Connect data", "Choosing a data source", { title: "Connect data" }),
          shot("journey/profile.webp", 1600, 1000, "Profile data", "The data profile with quality metrics", { title: "Profile data" }),
          shot("journey/generate.webp", 1600, 1000, "Generate dashboard", "The AI-generated dashboard", { title: "Generate dashboard" }),
          shot("journey/explore.webp", 1600, 1000, "Explore insights", "Exploring with the AI Assistant", { title: "Explore insights" }),
        ],
      },
    ],
    note: "The resulting design connects data preparation, visualization and AI-assisted exploration in one experience. Each stage is intended to reduce uncertainty while giving people the flexibility to investigate and act on their data.",
  },

  // ------------------------------------------------------------ Validation
  // Honest status: designed, not yet tested with users. The next step moved
  // here from the reflection.
  validation: {
    status: "Not yet validated with users.",
    body: "Datalyon was designed from scratch. The reasoning in this case study is design rationale — it hasn't yet been tested with users.",
    nextLabel: "Next validation step",
    next: "Evaluate whether first-time users can connect a dataset, understand its quality, generate a dashboard and confidently interpret an insight — without assistance.",
  },

  // ------------------------------------------------------------ Reflection
  reflection: {
    body: [
      "Working collaboratively on Datalyon reinforced an important lesson: simplifying a complex product isn't about removing powerful capabilities, but about making them easier to discover, understand and use.",
      "We focused on progressive disclosure, meaningful feedback, and an experience where AI supports people without taking away their control.",
    ],
  },
};

export default datalyon;
