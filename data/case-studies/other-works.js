// Other Works — two shorter project showcases on one page: ViewDent and
// Meta-flow.ai. Not full case studies: each is an intro (role, team,
// contribution) and a few stories of problem → approach → UX value, told
// through the real screens (see components/case-study/ProjectShowcase).
//
// Honesty: no research, metrics or launch claims. ViewDent was collaborative
// work with a fellow UI/UX designer — keep that explicit. Meta-flow.ai copy
// follows the project's UX documentation and describes the designed screens.
//
// Images: the supplied mockups. ViewDent screens are 2400 × 1350 (16:9);
// Meta-flow.ai screens 2400 × 1500 (16:10).

const dir = "/images/projects/other-works";

const shot = (path, width, height, label, alt, caption) => ({
  src: `${dir}/${path}`,
  width,
  height,
  label,
  alt,
  caption,
  quality: 90,
});
const viewdent = (name, label, alt, caption) => shot(`viewdent/${name}.webp`, 2400, 1350, label, alt, caption);
const metaflow = (name, label, alt, caption) => shot(`metaflow/${name}.webp`, 2400, 1500, label, alt, caption);

const otherWorks = {
  // Light, cool page; ViewDent blue as the accent, deep navy for frames and nav.
  theme: {
    background: "#F2F5FA",
    text: "#0E1A2E",
    line: "#D6DEEA",
    surface: "#0F2B57",
    accent: "#2350B8",
  },

  // ------------------------------------------------------------------ Hero
  category: "Selected design work",
  summary: "Two more projects, in short.",
  subheadline:
    "Concise looks at ViewDent and Meta-flow.ai — the problems, the design decisions and the screens behind them.",
  meta: [
    { label: "Projects", value: ["ViewDent", "Meta-flow.ai"] },
    { label: "Platforms", value: ["Mobile app", "Web app"] },
    { label: "Focus", value: ["UX guidance", "Interaction design", "UI design"] },
  ],
  heroPair: [
    shot(
      "viewdent-subscription.webp",
      2400,
      1500,
      "ViewDent · Subscription plans",
      "ViewDent's Subscription Plans on a phone balanced on a fingertip: the recommended All-in-One Plan at ₹1,499 a year, above a Custom Plan",
    ),
    shot(
      "metaflow-dashboard.webp",
      2400,
      1500,
      "Meta-flow.ai · Dashboard",
      "The meta-flow.ai dashboard on a desktop monitor against a deep blue wall",
    ),
  ],

  // -------------------------------------------------------------- Projects
  chapters: [
    {
      id: "viewdent",
      label: "ViewDent",
      title: "Making dental experiences more intuitive.",
      category: "Dental healthcare · Mobile app · UX/UI design",
      role: "UX guidance, interaction design, design reviews & collaboration",
      team: "With a fellow UI/UX designer",
      contribution: ["UX guidance", "Interaction design", "Design reviews", "UI collaboration"],
      description: [
        "ViewDent is a digital dental healthcare ecosystem that simplifies dental services and patient experiences through management tools, education and AI-powered smile visualization.",
        "I collaborated with a fellow designer to refine its mobile experience — clearer subscription choices, guided photo capture with real-time feedback, transparent processing and interactive smile comparisons that help people move through complex interactions with confidence.",
      ],
      stories: [
        {
          layout: "aside",
          label: "Subscription",
          title: "Simplifying subscription selection.",
          problem: "People need to understand different products and choose the right plan without feeling overwhelmed.",
          approach: [
            "Two clearly different options: All-in-One and Custom",
            "Feature labels — CMS, VMS, AI Smile Editor, Patient Education — show what a plan includes",
            "A clear hierarchy between price, benefits and selection",
            "An easy-to-find primary action",
          ],
          value: "Helps people understand their options and make a more informed choice.",
          images: [
            viewdent(
              "subscription",
              "Subscription plans",
              "Subscription Plans: the recommended All-in-One Plan with its included features and a ₹1,499 yearly price, above a Custom Plan option",
              "All-in-One vs Custom — features as labels, price and selection kept distinct.",
            ),
          ],
        },
        {
          layout: "stacked",
          label: "AI smile capture",
          title: "Making AI smile capture more intuitive.",
          problem:
            "AI smile visualization depends on a suitable photo, but people don't know the right lighting, distance or face position.",
          approach: [
            "A guidance screen for lighting, facing the camera, smiling and distance",
            "Correct and incorrect example photos make the instructions concrete",
            "Real-time face detection, lighting and distance feedback while capturing",
            "A face-alignment guide to position before the shot",
          ],
          value: "Capture feels guided rather than trial and error, so the AI gets photos it can use.",
          images: [
            viewdent(
              "guidelines",
              "Capture guidance",
              "Capture Guidance: photo guidelines for good lighting, facing the camera, showing your smile and proper distance, with correct and incorrect examples and Open Camera",
              "Guidance first — four tips, with a correct and an incorrect example.",
            ),
            viewdent(
              "capture-ready",
              "Live camera",
              "The live camera with Face detected, Lighting good and Move closer chips above an oval alignment guide and Hold steady",
              "Live feedback as status chips: face detected, lighting good, move closer.",
            ),
            viewdent(
              "capture-face",
              "Face alignment",
              "The live camera with a smiling face framed by the alignment grid, status chips and the capture button",
              "An alignment guide frames the face before capture.",
            ),
          ],
        },
        {
          layout: "stacked",
          label: "Processing & results",
          title: "Clear progress, honest results.",
          problem:
            "AI generation takes time, and a generated smile can read like a promise. People need to know processing is moving — and that the result is illustrative.",
          approach: [
            "A progress bar, time remaining and a live status such as “Analysing dentition”",
            "Permission to leave: a notification says when the previews are ready",
            "An interactive before / after slider to compare by dragging",
            "A clear note that AI results are illustrative, not a treatment outcome",
            "Save and Share for the visualization",
          ],
          value: "Waiting feels predictable, results are easy to explore, and expectations stay realistic.",
          images: [
            viewdent(
              "processing",
              "Creating previews",
              "Creating your previews: Analysing dentition, a progress bar with about 20 seconds remaining, a note that you can leave and will be notified, and Cancel",
              "Progress, time remaining and a status — plus permission to leave.",
            ),
            viewdent(
              "compare",
              "Smile comparison",
              "A before and after smile comparison with a drag handle, a disclaimer that the AI result is illustrative, and Save and Share",
              "Drag to compare; the disclaimer sets expectations.",
            ),
          ],
        },
      ],
    },
    {
      id: "meta-flow",
      label: "Meta-flow.ai",
      title: "Making enterprise automation easier to start and track.",
      category: "Enterprise SaaS · Workflow automation · Web app",
      role: "Product Designer / UI/UX Lead",
      contribution: ["Requirements to UX", "Information architecture", "Interaction design", "UI design"],
      description:
        "Meta-flow.ai is a no-code / low-code platform for building, running and monitoring business automations. I translated technical requirements into interfaces that show people where to start, how to begin a workflow and what has run.",
      note: "Shown as designed; the production status of each screen isn't confirmed here.",
      stories: [
        {
          layout: "aside",
          label: "Dashboard",
          title: "Put the primary job first.",
          problem:
            "An earlier dashboard put latest updates and upcoming features ahead of the work itself, so people had to work out where to start.",
          approach: [
            "A welcome banner leads with Create Workflow — the platform's main job",
            "Integrated apps such as Gmail, Oracle and PostgreSQL visible from the start",
            "Plan usage in plain sight — 3/5 processes remaining",
            "Latest updates kept below, as secondary information",
          ],
          value: "The most important action sits where attention lands first.",
          images: [
            metaflow(
              "dashboard",
              "Dashboard",
              "The meta-flow.ai dashboard: an Automate Smarter, Not Harder banner with Create Workflow, integrated apps, and Latest Updates below",
              "Create Workflow leads; updates come second.",
            ),
          ],
        },
        {
          layout: "aside",
          flip: true,
          label: "Starting a workflow",
          title: "Three clear ways to begin.",
          problem:
            "Starting a workflow mixed project and process terms, and reusing existing work wasn't obvious.",
          approach: [
            "Create Workflow — build from scratch",
            "Clone Workflow — duplicate an existing one for a quick setup",
            "Watch Tutorial — learn how it works first",
            "Each choice a distinct card with a one-line description",
          ],
          value: "People start the way that suits them: from scratch, from existing work, or by learning first.",
          images: [
            metaflow(
              "create",
              "Create",
              "The Create tab with three cards: Create Workflow, Clone Workflow and Watch Tutorial",
              "Three distinct starting points, each explained in a line.",
            ),
          ],
        },
        {
          layout: "stacked",
          label: "Monitoring",
          title: "Make operations easy to audit.",
          problem:
            "Teams need to know what ran, when, through which service and whether it failed — raw execution data makes that hard to scan.",
          approach: [
            "meta-flow Hub groups Agent Management, Jobs Management, Execution History, Trigger and Scheduler as tabs",
            "The Audit Log filters by date range, service, status and user (admin only)",
            "Status as readable badges — Success and Failed in words, not colour alone",
          ],
          value: "Answering “what ran, and what went wrong?” takes a filter, not a search through logs.",
          images: [
            metaflow(
              "hub",
              "meta-flow Hub — Audit Log",
              "meta-flow Hub's Audit Log: time, user, service, activity, description and Success or Failed status, with date, service, status and user filters and pagination",
              "One hub for operations; filters and readable statuses in the Audit Log.",
            ),
          ],
        },
      ],
    },
  ],
};

export default otherWorks;
