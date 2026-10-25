// Metaflow.ai — simplifying enterprise automation.
//
// Source: the project's UX documentation (Metaflow_AI_Complete_UX_Product_
// Design_Documentation.pdf) and the brief. No research, metrics or outcomes
// are claimed. Notes the documentation records as discussed / recommended
// but not confirmed in production are marked `proposed: true` and render
// with a "Proposed" tag — keep that distinction until shipping is confirmed.
//
// Structure: hero → challenge → three chapters (Design Studio gets the most
// room, then integrations, then monitoring) → outcome & learning. Each
// chapter uses a different layout (see components/case-study/SolutionChapter).
//
// Images: all placeholders until the real screenshots are exported to the
// listed paths at the listed size (lib/case-study.js → IMAGE_SIZES). Check
// each chapter's notes against the final screenshot and update every `alt`.

import { image } from "@/lib/case-study";

const dir = "/images/projects/metaflow/case-study";

const metaflow = {
  // Light, cool page with the project's near-black for image frames and the
  // section nav; indigo accent for numbers and notes.
  theme: {
    background: "#EEF0F5",
    text: "#16171D",
    line: "#D2D6E1",
    surface: "#15161B",
    accent: "#4B55D1",
  },

  // Chapters number themselves ("01 / Design Studio"), so the other sections
  // show their label only.
  numbered: false,

  // ------------------------------------------------------------------ Hero
  title: "Metaflow.ai",
  category: "Enterprise SaaS / Intelligent Process Automation",
  summary: "Simplifying enterprise automation.",
  subheadline:
    "Making complex workflow creation, integrations and automation management intuitive for everyone.",
  meta: [
    { label: "Role", value: "Product Designer / UI/UX Lead" },
    { label: "Industry", value: "Enterprise SaaS" },
    { label: "Focus", value: ["Workflow Automation", "UX/UI", "Product Design"] },
    { label: "Platform", value: "Web Application" },
  ],
  // IMAGE: the Design Studio — the product's main working surface.
  hero: image(`${dir}/hero/design-studio.webp`, {
    size: "wide",
    quality: 90,
    label: "Metaflow Design Studio",
    alt: "The Metaflow Design Studio: activity library, workflow canvas and step configuration",
  }),

  labels: {
    challenge: "The challenge",
    outcomes: "Outcome & learning",
  },
  headings: {
    outcomes: "Designing for complexity, without making users feel it.",
  },

  // ------------------------------------------------------------- Challenge
  challenge: {
    statement: "Powerful automation. Complex experiences.",
    body: [
      "Metaflow enables businesses to automate sophisticated workflows, but configuring activities, connecting applications and monitoring executions can be challenging for users without technical expertise.",
      "The challenge was to simplify these interactions while preserving the flexibility and capabilities enterprise users need.",
    ],
  },

  // -------------------------------------------------------------- Chapters
  chapters: [
    {
      id: "design-studio",
      label: "Design Studio",
      title: "Making complex workflows easier to build.",
      layout: "feature",
      problem:
        "Building workflows involves navigating activities, configuring inputs, managing dependencies and controlling execution.",
      solution:
        "I refined the Design Studio experience by improving canvas controls, organising workflow actions, simplifying activity configuration, and making activity references and output reuse easier to understand.",
      // IMAGE: the main canvas with a few configured steps.
      main: {
        ...image(`${dir}/studio/canvas.webp`, {
          size: "screen",
          quality: 90,
          label: "Design Studio — canvas",
          alt: "Design Studio canvas with the activity library, connected workflow steps and canvas controls",
        }),
        title: "Design Studio canvas",
        notes: [
          "Canvas controls — zoom, fit view and Back to Center — grouped beside the canvas.",
          "Workflow actions in one place: Save, Run and Download Agent, renamed from the ambiguous “Engine”.",
          "A searchable activity library on the left; a step's configuration appears only when it's selected.",
          { text: "Find Step searches the steps already on the canvas, kept separate from adding activities.", proposed: true },
        ],
      },
      supporting: [
        // IMAGE: one activity selected — its inputs, outputs and references.
        {
          ...image(`${dir}/studio/activity-configuration.webp`, {
            size: "screen",
            quality: 90,
            label: "Activity configuration and outputs",
            alt: "An activity's configuration with separate Inputs and Outputs and an input taken from an earlier step's output",
          }),
          title: "Activity configuration & output reuse",
          notes: [
            "Inputs and Outputs as separate, labelled sections.",
            "Each input is Manual or From Output — reuse earlier data instead of uploading it again.",
            "Outputs show their name, data type and the step that produced them.",
            { text: "Friendly step names, e.g. “Read Specific Sheet #3”, instead of long internal IDs.", proposed: true },
          ],
        },
        // IMAGE: the Decision Maker with grouped conditions.
        {
          ...image(`${dir}/studio/decision-maker.webp`, {
            size: "screen",
            quality: 90,
            label: "Decision Maker",
            alt: "The Decision Maker building grouped conditions for a workflow branch",
          }),
          title: "Decision Maker — conditional logic",
          notes: [
            { text: "Rules read as When / Field / Comparison / Value.", proposed: true },
            { text: "AND / OR become “All conditions match” / “Any condition matches”.", proposed: true },
            { text: "Add Rule and Add Condition Group are separate actions.", proposed: true },
          ],
        },
      ],
      principles: [
        "Reduced cognitive load",
        "Clear information hierarchy",
        "Progressive disclosure",
        "Better discoverability",
        "Consistent interaction patterns",
      ],
    },
    {
      id: "integrations",
      label: "Integrations",
      title: "Making technical connections more approachable.",
      layout: "pair",
      problem:
        "Connecting third-party applications and databases involves different authentication methods, credentials and connection states.",
      solution:
        "I designed structured integration flows with clear input labels, contextual guidance, account selection and easier connection management.",
      images: [
        // IMAGE: the App Marketplace gallery.
        {
          ...image(`${dir}/integrations/app-marketplace.webp`, {
            size: "screen",
            quality: 90,
            label: "App Marketplace",
            alt: "The App Marketplace with app and connector cards grouped by category",
          }),
          title: "App Marketplace",
        },
        // IMAGE: one connection setup — PostgreSQL or Snowflake.
        {
          ...image(`${dir}/integrations/connection-setup.webp`, {
            size: "panel",
            quality: 90,
            label: "Connection setup — PostgreSQL / Snowflake",
            alt: "A database connection form with labelled credential fields and guidance",
          }),
          title: "Connection setup",
        },
      ],
      notesLabel: "How setup stays approachable",
      notes: [
        "Apps grouped as Predefined Apps, User Defined Apps and Extensions & Connectors.",
        "Each card's action matches the task — Connect for a connector, open the tool for a utility.",
        "Credential forms with visible labels, format examples, show / hide password and inline validation.",
        "Account selection and Manage Connections, so one connector can hold several accounts.",
      ],
    },
    {
      id: "monitoring",
      label: "Monitoring",
      title: "Turning operational complexity into clarity.",
      layout: "split",
      problem:
        "Users need to understand whether agents are connected, workflows are running and executions require attention.",
      solution:
        "I improved Agent Management, agent setup and the Process Tracker by prioritising meaningful statuses, organised operational data and clear next actions.",
      why: "Each screen answers one operational question — is my agent ready, what ran, and what needs my attention — so people can act without decoding the system.",
      notes: [
        "Agent state (Active / Inactive) kept separate from instance state (Running / Idle), with text counts, not colour alone.",
        "Refresh and Delete on each agent; deleting asks for confirmation.",
        "Process Tracker shows Project, Process, Status, Execution Time and Date, with readable status badges, newest first.",
        { text: "Search by process or project, filter by status and date, and open a run for its details.", proposed: true },
        "No agent yet? Setup becomes two ordered steps: Download Agent, then Register Agent.",
      ],
      images: [
        // IMAGE: Agent Management list.
        {
          ...image(`${dir}/monitoring/agent-management.webp`, {
            size: "screen",
            quality: 90,
            label: "Agent Management",
            alt: "Agent Management listing agents with their status, running and idle instances, and actions",
          }),
          title: "Agent Management",
        },
        // IMAGE: Process Tracker table.
        {
          ...image(`${dir}/monitoring/process-tracker.webp`, {
            size: "screen",
            quality: 90,
            label: "Process Tracker",
            alt: "The Process Tracker table of executions with project, process, status, execution time and date",
          }),
          title: "Process Tracker",
        },
      ],
      // IMAGE (optional): the redesigned agent setup dialog.
      inset: {
        ...image(`${dir}/monitoring/agent-setup.webp`, {
          size: "panel",
          quality: 90,
          label: "Agent setup dialog",
          alt: "The agent setup dialog: step one Download Agent, step two Register Agent",
        }),
        title: "Agent setup",
      },
    },
  ],

  // --------------------------------------------------------------- Outcome
  // Qualitative only — no measured results exist yet.
  outcomes: {
    body: [
      "My work focused on a more understandable and cohesive experience across workflow creation, integrations and automation monitoring.",
      "The design decisions emphasised three principles:",
    ],
    qualitative: [
      { title: "Clarity", text: "Make technical information easier to understand." },
      { title: "Efficiency", text: "Simplify common workflows and reduce unnecessary interactions." },
      { title: "Control", text: "Help users understand system behaviour and confidently manage automations." },
    ],
    qualitativeColumns: 3,
    closing:
      "This project strengthened my ability to translate complex enterprise requirements into practical, intuitive product experiences through UX problem-solving and cross-functional collaboration.",
  },
};

export default metaflow;
