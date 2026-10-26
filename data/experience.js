// Career timeline, newest first. The Journey section renders whatever is
// here, so roles, periods and descriptions can be edited or added freely.
// `company` is the employer only (projects and clients belong in the case
// studies); `promotedFrom` marks a promotion within the same company,
// `scope` is a line about the role's scope, `level` is the short name in the
// Journey progression line, and `training: true` folds an entry into a
// small "Training" line instead of a role card. The first entry is the
// current role (data/profile.js).

// Written out in full so it can't be read as "Meta" at a glance.
const MFD = "MFD (Meta For Data Technologies)";

export const experience = [
  {
    role: "UX/UI Lead",
    level: "Lead",
    company: MFD,
    promotedFrom: "UX/UI Designer",
    period: "2025 — Present",
    description:
      "Leading product design across enterprise and consumer products, working closely with product, engineering and design teams.",
  },
  {
    role: "UX/UI Designer",
    level: "Designer",
    company: MFD,
    period: "2025",
    description:
      "Designed end-to-end product experiences across healthcare, automation, data intelligence and enterprise platforms.",
  },
  {
    role: "Junior UX/UI Designer",
    level: "Junior",
    company: "Tradehike",
    period: "2023 — 2024",
    description:
      "Worked on user flows, interface design, prototypes and design systems across multiple digital products.",
  },
  {
    role: "UX/UI Intern",
    level: "Intern",
    company: "M90 Technologies",
    period: "2023",
    description:
      "Worked on early product design assignments and strengthened practical UX/UI design skills.",
  },
  {
    role: "UX/UI Apprentice",
    company: "MyCaptain",
    period: "2023",
    training: true,
    description:
      "Built my foundation in user experience, interface design and practical product-design workflows.",
  },
];
