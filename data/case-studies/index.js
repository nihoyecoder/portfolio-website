// Case-study registry. Order and "next project" follow data/projects.js.
//
// Content shape (every key optional; the page renders only what exists).
// Copy fields marked ¶ can be a string or a list of paragraphs; "\n" inside
// a heading forces a line break.
//
//   title, summary, category override the project's title / description / subtitle (this page only)
//   subheadline              a line under the summary
//   numbered: false          sections show their label without "01 —"
//   context                  { zeroToOne?, company?, role?, team?, product?, status?, timeline?,
//                              platforms?, ownership?: [] } — the professional context block
//                            (CaseStudyMeta: fixed labels and order; leave out anything unknown,
//                            never guess). zeroToOne only for products designed from scratch.
//   meta                     [{ label, value }]  free-form alternative to `context`; value may be a string or list
//   hero                     image()             defaults to the lead Selected Work visual
//   headings                 { [sectionKey]: "…" } overrides a section's default heading
//   labels                   { [sectionKey]: "…" } overrides a section's label ("01 — …")
//   theme                    { background, text, line, surface, accent? } page colours (this study only)
//   challenge                { statement, body¶, problems: [{ title, text? }], note?, users?, media? }
//                            users here: { title, groups, ecosystem?: { providers: [a, b], hub, consumers } }
//   research                 { body¶, methods: [], competitors: [], insightsTitle, insights: [{ title, text }], media? }
//   users                    { groups: [{ title, text }] }
//   constraints              { items: [{ title, text }] }
//   approach                 { principles: [{ title, text }], media? }
//   decisions                [{ title, problem¶, decision¶, why¶, shift?, media?, impact¶? | outcome¶? }]
//                            shift: { unit, before: [], after: [], merges: [{ from: [], into }] }
//                                or { kind: "flow", before: [steps], after: [steps] }
//   chapters                 [{ id, label, nav?, title, layout: "feature" | "pair" | "split",
//                              problem¶, solution¶, why¶?, notes?, notesLabel?,
//                              main?, supporting?, images?, inset?, principles?, principlesLabel? }]
//                            each chapter is its own section and nav item ("01 / label");
//                            images are image() plus { title, caption?, notes? };
//                            a note is a string or { text, proposed: true }
//   experience               [{ title, goal, body¶?, tags?, tagsLabel?, annotations?, layout?: "split", media }]
//   operations               { body¶, relations?, groups?, areas?: [{ title, text }], statement?,
//                              progressive?: { title, body¶, steps: [], why }, media? }
//                            (an item's `text` may be a list, shown inline)
//   visualLanguage           { principle, body¶, colors: [{ hex, name, rationale }], specs: [{ name, value?, rationale }] }
//   designSystem             { statement?, body¶, platforms: [name | { name, detail }], covers: [],
//                              principle?, visualLanguage?: { title, …visualLanguage }, media: [] }
//   website                  { body¶, contrast: [{ title, text }], journey: [], media?, note? }
//   beforeAfter              { title?, before: image(), after: image(), changes: [] } — real redesigns only
//   tradeoffs                { title?, items: [{ title, text }], themes: [], example: { title, body } }
//   outcomes                 { body¶?, metrics: [{ value, label }], qualitative: [{ title, text }],
//                              qualitativeColumns?, highlights: [], points: [], learning?: { title, body¶ },
//                              closing? }
//   reflection               { body¶ (first paragraph is the lead), next: "…" or [up to 3 points] }
//   nextProject              slug, to override the automatic order
//   status: "in-progress"    shows a short note instead of the narrative
//
// media: { layout, … } where layout is one of
//   "full" | "wide"                 { image }
//   "two-up" | "three-up"          { images: [] }  (more images wrap into extra rows)
//   "phones" | "sequence"          { images: [] }  (mobile screens; sequence shows each
//                                                    image's `title` and `caption` as a step)
//   "before-after"                 { before, after }
// Any media can also take a `caption`.

import { projects } from "@/data/projects";
import cetasika from "./cetasika";
import datalyon from "./datalyon";
import oneev from "./oneev";
import otherWorks from "./other-works";

const studies = { cetasika, datalyon, "1ev": oneev, "other-works": otherWorks };

export const caseStudySlugs = projects.map((project) => project.id);

// { project, study, next } for a slug, or null if there is no such project.
export function getCaseStudy(slug) {
  const index = projects.findIndex((project) => project.id === slug);
  if (index === -1) return null;

  const project = projects[index];
  const study = studies[slug] ?? { status: "in-progress" };
  const nextSlug = study.nextProject ?? projects[(index + 1) % projects.length].id;
  const next = projects.find((candidate) => candidate.id === nextSlug);

  return { project, study, next };
}
