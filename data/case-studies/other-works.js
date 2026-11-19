// Other Works — two shorter project showcases on one page: ViewDent and
// Meta-flow.ai. Not full case studies: each is an intro (role, team,
// contribution) and a few stories of problem → approach → UX value, told
// through the real screens (see components/case-study/ProjectShowcase).
//
// Honesty: no research, metrics or launch claims. ViewDent was collaborative
// work with a fellow UX/UI designer — keep that explicit. Meta-flow.ai copy
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
  subheadline: "ViewDent and Meta-flow.ai: a few key decisions each, told through the screens.",
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
      team: "With a fellow UX/UI designer",
      contribution: ["UX guidance", "Interaction design", "Design reviews", "UI collaboration"],
      description:
        "A dental healthcare ecosystem with management tools, patient education and AI smile visualization. With a fellow designer, I refined its mobile experience.",
      stories: [
        {
          layout: "aside",
          label: "Subscription",
          title: "Simplifying subscription selection.",
          problem: "People had to compare several products and pick a plan without feeling overwhelmed.",
          approach: ["Two distinct plans: All-in-One and Custom", "Features as labels; price, benefits and action in clear order"],
          value: "Options are easy to understand and compare.",
          images: [
            viewdent(
              "subscription",
              "Subscription plans",
              "Subscription Plans: the recommended All-in-One Plan with its included features and a ₹1,499 yearly price, above a Custom Plan option",
              "All-in-One vs Custom.",
            ),
          ],
        },
        {
          layout: "stacked",
          label: "AI smile capture",
          title: "Making AI smile capture more intuitive.",
          problem: "The AI needs a suitable photo, but people don't know the right lighting, distance or position.",
          approach: ["Guidance first, with correct and incorrect examples", "Live face, lighting and distance feedback while capturing"],
          value: "Guided, not trial and error, so the AI gets usable photos.",
          images: [
            viewdent(
              "guidelines",
              "Capture guidance",
              "Capture Guidance: photo guidelines for good lighting, facing the camera, showing your smile and proper distance, with correct and incorrect examples and Open Camera",
              "Guidance first.",
            ),
            viewdent(
              "capture-ready",
              "Live camera",
              "The live camera with Face detected, Lighting good and Move closer chips above an oval alignment guide and Hold steady",
              "Live feedback as status chips.",
            ),
            viewdent(
              "capture-face",
              "Face alignment",
              "The live camera with a smiling face framed by the alignment grid, status chips and the capture button",
              "An alignment guide frames the face.",
            ),
          ],
        },
        {
          layout: "stacked",
          label: "Processing & results",
          title: "Clear progress, honest results.",
          problem: "Generation takes time, and a generated smile can read like a promise.",
          approach: ["Progress, time remaining and permission to leave", "A before / after slider, marked as illustrative"],
          value: "Predictable waiting, realistic expectations.",
          images: [
            viewdent(
              "processing",
              "Creating previews",
              "Creating your previews: Analysing dentition, a progress bar with about 20 seconds remaining, a note that you can leave and will be notified, and Cancel",
              "Progress, and permission to leave.",
            ),
            viewdent(
              "compare",
              "Smile comparison",
              "A before and after smile comparison with a drag handle, a disclaimer that the AI result is illustrative, and Save and Share",
              "Drag to compare.",
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
      role: "Product Designer / UX/UI Lead",
      contribution: ["Requirements to UX", "Information architecture", "Interaction design", "UI design"],
      description:
        "A no-code / low-code platform for business automations. I turned technical requirements into screens that show where to start and what has run.",
      note: "Shown as designed; the production status of each screen isn't confirmed here.",
      stories: [
        {
          layout: "aside",
          label: "Dashboard",
          title: "Put the primary job first.",
          problem: "An earlier dashboard led with updates and upcoming features, not the work itself.",
          approach: ["Create Workflow leads; integrations and plan usage in view", "Updates moved below"],
          value: "The main action sits where attention lands first.",
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
          problem: "Starting mixed project and process terms, and reuse wasn't obvious.",
          approach: ["Create, Clone or Watch Tutorial: three distinct cards"],
          value: "People start the way that suits them.",
          images: [
            metaflow(
              "create",
              "Create",
              "The Create tab with three cards: Create Workflow, Clone Workflow and Watch Tutorial",
              "Three ways to begin.",
            ),
          ],
        },
        {
          layout: "stacked",
          label: "Monitoring",
          title: "Make operations easy to audit.",
          problem: "Raw execution data made “what ran, and did it fail?” hard to answer.",
          approach: ["One hub for operations, with a filterable Audit Log", "Success and Failed as words, not colour alone"],
          value: "A filter, not a search through logs.",
          images: [
            metaflow(
              "hub",
              "meta-flow Hub — Audit Log",
              "meta-flow Hub's Audit Log: time, user, service, activity, description and Success or Failed status, with date, service, status and user filters and pagination",
              "The Audit Log: filters and readable statuses.",
            ),
          ],
        },
      ],
    },
  ],
};

export default otherWorks;
