// Cetasika — the first full case study, and the reference for the others.
//
// Title, category, colours and the Selected Work visuals come from
// data/projects.js. Everything below is case-study content; any section can
// be removed (or set to null) and the page skips it. Copy fields can be a
// string or a list of paragraphs; "\n" forces a line break in a heading.
//
// Kept deliberately short (a 3–5 minute read): problem and users, five
// decisions, one solution overview of the app and clinic CMS, the design
// system, the website, and the outcome.
//
// Images: every image below is still a placeholder. Export WebP files to the
// listed paths at the listed size (lib/case-study.js → IMAGE_SIZES); the page
// swaps the placeholder for the image as soon as the file exists. The comment
// above each image says what it should show. Update its `alt` to describe the
// final image.

import { image } from "@/lib/case-study";

const dir = "/images/projects/cetasika/case-study";

// An annotated composition at its real exported size (3840 × 2160), so its
// marker boxes ([x1, y1, x2, y2]) are in the image's own pixels.
const shot = (path, label, alt) => ({ src: `${dir}/${path}`, width: 3840, height: 2160, label, alt, quality: 90 });

const cetasika = {
  // Optional page theme (this case study only): page background, text,
  // lines, and surfaces (image frames, the sticky section nav).
  theme: {
    background: "#E6F4FD",
    text: "#27242F",
    line: "#115C61",
    surface: "#115C61",
    accent: "#115C61", // numbers and step labels (the project accent is for dark slides)
  },

  // ---------------------------------------------------------------- Overview
  summary:
    "Designing a connected healthcare and wellness experience across Consumer App, Provider CMS and Web — helping patients discover care while enabling doctors and wellness centres to manage the services behind it.",

  // Professional context (components/case-study/CaseStudyMeta). Only facts
  // from this file; the company isn't recorded here yet, so it's left out.
  context: {
    zeroToOne: true,
    role: "Product Designer · UX/UI Lead",
    team: "Worked with frontend engineering",
    timeline: "2025–2026",
    platforms: "Consumer App · Provider CMS · Website",
    ownership: [
      "Product Strategy",
      "UX Architecture",
      "UX/UI Design",
      "Design System",
      "Prototyping",
      "Frontend Collaboration",
    ],
  },

  // IMAGE: one composition of the Consumer App, CMS and Website together.
  hero: image(`${dir}/hero/overview.webp`, {
    size: "wide",
    quality: 90,
    label: "Cetasika ecosystem — App, CMS and Website",
    alt: "Cetasika across the consumer app, provider CMS and website",
  }),

  // Section labels and headings that differ from the defaults in CaseStudy.jsx.
  labels: {
    challenge: "Problem",
    decisions: "Design Decisions",
    operations: "Solution",
    designSystem: "Design System",
    website: "Website",
    outcomes: "Outcome",
  },
  headings: {
    decisions: "Decisions that shaped the product.",
    operations: "One connected product for patients, providers and clinics.",
    designSystem: "Turning repeated decisions into a system.",
    website: "Translating the product into a brand experience.",
    outcomes: "What changed.",
  },

  // ------------------------------------------------------ 01 Problem + users
  challenge: {
    statement: "Healthcare and wellness were becoming fragmented.",
    body: [
      "As Cetasika expanded from doctor appointments into wellness services, centres, packages and ongoing care, every new capability added another layer of complexity.",
      "The challenge was to create one understandable ecosystem without turning the product into separate experiences for every provider or service.",
    ],
    problems: [
      {
        title: "Too many provider types",
        text: "Different wellness services were becoming separate account structures.",
      },
      {
        title: "Fragmented discovery",
        text: "Users had to understand provider categories before finding care.",
      },
      {
        title: "Different booking models",
        text: "Doctors, wellness services and packages behaved differently.",
      },
      {
        title: "Operational complexity",
        text: "Consumer experiences depended on information configured by Doctors and Centres.",
      },
    ],
    note: "Research across healthcare and wellness platforms helped identify recurring patterns around discovery, provider trust, availability and booking.",
    users: {
      title: "Three sides of one ecosystem.",
      groups: [
        {
          title: "Patients",
          text: "Discover doctors and wellness services, compare providers, book care and manage appointments.",
        },
        {
          title: "Doctors",
          text: "Manage profiles, clinic locations, availability, appointments and patient interactions.",
        },
        {
          title: "Wellness Centres",
          text: "Manage services, trainers, packages, availability and bookings.",
        },
      ],
      // Rendered as a live diagram (no image needed).
      ecosystem: { providers: ["Doctors", "Wellness Centres"], hub: "Cetasika", consumers: "Patients" },
    },
  },

  // ---------------------------------------------------------- 02 Decisions
  decisions: [
    {
      title: "Let users search by need, not product structure.",
      problem: [
        "Users don't always know which kind of wellness centre they need.",
        "Someone may want relief from back pain, help with stress or a prenatal session without knowing whether that sits under yoga studios, massage centres or spas, or how Cetasika classifies it internally.",
      ],
      decision: [
        "Structure centre discovery around:",
        // A nested list renders inline ("a · b · c") and reads as a list.
        ["Wellness concern", "Centre category", "Service", "Location and distance", "Availability"],
        "Search starts from a wellness concern. Categories such as Yoga Studios or Massage & Spa group centres the way people recognise them, and service filters narrow the list. Each centre then shows its services, prices, trainers and locations before a session is requested.",
      ],
      why: "The interface should follow the user's mental model (what they need help with) instead of expecting them to understand how Cetasika categorises centres and services.",
      // IMAGE: one composition of the four steps from home to requesting a
      // centre session (2400 × 1350, so the markers are in those pixels).
      media: {
        layout: "annotated",
        caption: "Home → Wellness centres → Centre services → Request appointment",
        markers: [
          { n: 1, box: [126, 338, 654, 420] },
          { n: 2, box: [126, 626, 654, 922] },
          { n: 3, box: [670, 513, 1187, 657] },
          { n: 4, box: [670, 672, 1187, 874] },
          { n: 5, box: [1218, 631, 1727, 1176] },
          { n: 6, box: [1758, 557, 2272, 1145] },
        ],
        notes: [
          "Search starts from a wellness concern, not a provider type.",
          "Centres are grouped the way people look for them: yoga studios, massage centres and spas.",
          "Inside a category, service filters such as Therapeutic Yoga or Prenatal narrow the list.",
          "Each centre card answers the next questions: price per session and whether it's available today.",
          "A centre's services open in a sheet, each with what it's for and its price.",
          "On the centre's page, people pick a service and a location, see the session fee, then request an appointment.",
        ],
        image: image(`${dir}/decisions/01-discovery-v2.webp`, {
          size: "wide",
          quality: 90,
          label: "Need-led discovery flow",
          alt: "Four app screens: the patient home with wellness categories, a list of therapeutic yoga centres, a centre's services with prices, and a studio page for choosing a service and location before requesting an appointment",
        }),
      },
      impact:
        "Users can begin with what they know — their need — and progressively reach the right centre, service and location to book a session.",
    },
    {
      title: "Show one centre once — even when it offers multiple services.",
      problem: [
        "A wellness centre offering several services could appear multiple times in the All results.",
        "From the system's perspective these may be multiple service relationships. From the user's perspective, it is still one centre.",
      ],
      decision: [
        "Make the Centre the primary result entity.",
        "Services become attributes, tags and filtering options attached to that centre.",
      ],
      why: "Users choose between actual centres, not database relationships.",
      // IMAGE: the centre results and their empty state (Figma Cetasika-App
      // 24985:4691 and 24985:4633), with the distances pulled out beside the list.
      media: {
        layout: "annotated",
        caption: "One list of centres, nearest first, and a clear empty state when none is nearby.",
        image: shot(
          "decisions/02-centre-results.webp",
          "Centre results — nearest first, and the empty state",
          "Two app screens. Therapeutic Yoga Centers: search, service filters (All, Therapeutic Yoga, Prenatal Yoga) and four centre cards, each with service tags and its distance, with the distances pulled out beside the list in order: 1.2, 2.6, 4.7 and 6.2 km, nearest first. Physiotherapy Clinics with the Therapeutic Yoga filter selected: No Centers Available, we couldn't find any centers in this area right now.",
        ),
        markers: [
          { n: 1, box: [918, 608, 1550, 802] },
          { n: 2, box: [920, 826, 1530, 1122] },
          { n: 3, box: [1640, 790, 2030, 1945] },
          { n: 4, box: [2384, 918, 2846, 1282] },
        ],
        notes: [
          "Search and service filters narrow one list of centres.",
          "One card per centre: its services show as tags, with “+4 more”, instead of the centre repeating for each service.",
          "Nearest first: results are ordered by distance, and every card shows how far away the centre is.",
          "Edge case: when no centre is available in the area, the screen says so plainly, and search and filters stay in place.",
        ],
      },
      impact: "Cleaner results, less repetition and a structure that continues to work as centres add more services.",
    },
    {
      title: "Keep users informed through every booking state.",
      problem: [
        "Booking a doctor is not always one instant action. A booking can move through multiple states:",
        "Request sent → Pending approval → Booking approved → Payment required → Payment completed → Appointment ready",
        "Without clear feedback between these stages, users may not know whether their booking was accepted, whether payment is required, whether payment succeeded or what they need to do next.",
      ],
      decision: [
        "Design the booking experience around explicit status, contextual next actions and clear confirmation at every major transition.",
        "The appointment experience should continuously communicate:",
        ["Where am I?", "What happened?", "What should I do next?"],
        "Pending Approval → Booking Approved → Proceed to Pay → Payment Summary → Slide to Pay → Payment Successful → Appointment becomes actionable",
        "Depending on the appointment state, relevant actions can then appear, such as:",
        ["Reschedule", "Cancel", "Proceed to Pay", "Get Directions", "Session OTP", "Book Again", "Rate Your Experience"],
      ],
      why: [
        "Doctor approval, payment and the actual appointment are separate parts of the same journey.",
        "Users should never have to guess whether the booking is confirmed or what action is expected from them next.",
      ],
      // IMAGE: Payment Summary, Payment Successful and My Appointments (Figma
      // Cetasika-App 24986:5428, 24986:5316 and 24986:4897). The long list is
      // shown in two parts: its first screen, then the rest from the fourth card.
      media: {
        layout: "annotated",
        caption:
          "Every state answers three questions: where am I, what happened, and what do I need to do next?",
        image: shot(
          "decisions/03-booking-states-v2.webp",
          "Booking states — pay, confirm and track",
          "Four app screens. Payment Summary: a fee breakdown with the total payable of ₹1,059, important information, the refund notice and Slide to Pay. Payment Successful: status, date, time, payment method, Download Receipt and View Appointment. My Appointments, in two parts: Pending Approval with Reschedule; Booking Approved with Cancel and Proceed to Pay; a paid booking with Get Directions and a Session OTP to share with the doctor; Cancelled with Book Again; and a past appointment with Rate Your Experience.",
        ),
        markers: [
          { n: 1, box: [153, 669, 884, 1173] },
          { n: 2, box: [131, 1793, 901, 1929] },
          { n: 3, box: [1093, 669, 1854, 1406] },
          { n: 4, box: [2037, 735, 2800, 1610] },
          { n: 5, box: [2932, 191, 3695, 777] },
          { n: 6, box: [2932, 785, 3695, 1775] },
        ],
        notes: [
          "Every charge is itemised before paying, with the total payable highlighted; booking and refund terms sit right below.",
          "Slide to Pay shows the amount and makes paying a deliberate gesture, not an accidental tap.",
          "The confirmation states the outcome and the details (status, date, time, method, receipt), then one next step: View Appointment.",
          "Each booking shows its status in words and colour, with only the actions that status allows: Reschedule while pending, Proceed to Pay once approved.",
          "Once paid, the appointment becomes actionable: Get Directions, and a Session OTP to share with the doctor.",
          "Closed bookings still lead somewhere: Book Again after a cancellation, Rate Your Experience after a visit.",
        ],
      },
      impact: [
        [
          "Reduces uncertainty",
          "Makes approval and payment states easier to understand",
          "Prevents users from missing required actions",
          "Provides explicit payment confirmation",
          "Keeps appointment actions relevant to the current state",
          "Creates continuity from booking request to appointment day",
        ],
      ],
    },
    {
      title: "Let doctors manage availability around their actual schedule.",
      problem: [
        "Doctors don't always work within one strict, identical daily time window. A fixed schedule such as 9 AM → 5 PM wouldn't represent many doctors' real availability.",
        "A doctor may want to consult:",
        ["In the morning on one day", "In the afternoon on another", "Late in the evening on another", "With different slots for different dates"],
      ],
      decision: [
        "Let doctors create and manage appointment slots around their own availability rather than forcing every appointment into one predefined working-hours range. The scheduling model supports valid slots at any time across a 24-hour day — not automatic 24/7 availability.",
        "Doctors control:",
        ["Available day / date", "Available time", "Appointment slots", "Their own booking availability"],
      ],
      why: "The product should adapt to the doctor's schedule rather than forcing the doctor to adapt to the product.",
      // IMAGE: one composition of the availability flow (exported at 3840px for
      // HD). The phones face straight on, so each marker is a band across one.
      media: {
        layout: "annotated",
        caption: "Set availability → See slots by date → Manage individual slots",
        image: shot(
          "decisions/04-doctor-availability.webp",
          "Doctor availability — flexible slot management",
          "Three Availability and Slots screens: setting a location, appointment type, date, start and end time, slot duration, buffer and weekly repeat; schedules listed by date for each clinic; and one schedule expanded to tick individual 15-minute slots on or off",
        ),
        markers: [
          { n: 1, box: [503, 505, 1350, 862] },
          { n: 2, box: [503, 890, 1350, 1392] },
          { n: 3, box: [503, 1412, 1350, 1772] },
          { n: 4, box: [1496, 866, 2344, 1347] },
          { n: 5, box: [2488, 1125, 3337, 1497] },
        ],
        notes: [
          "Each schedule belongs to a clinic location and a consultation type: video or in-clinic.",
          "Doctors pick the date and their own start and end times, instead of one fixed working day.",
          "Slot duration, the buffer between appointments and a weekly repeat are set once for the schedule.",
          "Schedules are listed by date, each card summarising its clinic, type, hours, days, slot duration, repeat and buffer.",
          "A schedule expands into its slots, and individual slots can be switched on or off.",
        ],
      },
      impact:
        "More realistic scheduling, greater flexibility and control for providers, and support for doctors with different consulting patterns.",
    },
    {
      // The clinic-management CMS (Main Admin, Staff / Receptionists, Doctors)
      // — not the Wellness Centre side. Roles and controls follow the CMS
      // screenshots; don't add permissions they don't show.
      title: "Design one appointment system for three operational roles.",
      context: [
        "The Cetasika CMS is the clinic-management system, designed for:",
        ["Main Admin", "Staff / Receptionists", "Doctors"],
        "It supports clinic operations including:",
        [
          "Dashboard",
          "Queue",
          "Appointments",
          "Patients",
          "Doctors",
          "Receptionists / Staff",
          "Prescriptions",
          "Payments / Billing",
          "Settings",
        ],
      ],
      problem: [
        "Appointments are handled by multiple people inside the clinic. The Main Admin needs operational visibility, Staff / Receptionists need to create and coordinate bookings, and Doctors need a focused view of their own patients, availability and appointments.",
        "Giving all three roles the exact same interface would either create unnecessary complexity or fail to support their individual responsibilities.",
      ],
      decision: [
        "Create one shared clinic appointment system while presenting the information and controls in the context each role needs.",
        "“One operational system, different levels of control and context.”",
        "Main Admin / Staff → Create Appointment → Enter Appointment Details → Assign Patient → Assign Doctor → Schedule Appointment → Appointment enters clinic schedule / queue → Doctor sees it in their appointment view",
      ],
      why: [
        "All three roles work with the same underlying appointment information, but their responsibilities are different.",
        "The design keeps appointment data connected while reducing unnecessary information for each role.",
      ],
      principlesLabel: "Three roles, one system",
      principles: [
        {
          title: "Main Admin",
          text: [
            "Clinic-wide oversight:",
            [
              "Total appointments",
              "Patients today",
              "Revenue",
              "Total visits",
              "Today's appointments",
              "Live queue",
              "Doctors",
              "Staff / Receptionists",
              "Prescriptions",
              "Payments / Billing",
              "Clinic settings",
            ],
          ],
          why: "The Main Admin should be able to understand clinic operations without opening every individual module.",
        },
        {
          title: "Staff / Receptionists",
          text: [
            "Staff support daily appointment operations. Manual appointment creation is divided into two clear steps.",
            "Step 01 — Appointment details:",
            ["Appointment Type", "Date", "Reason for Visit", "Appointment Status", "Booked or Waitlist", "Notes for Staff"],
            "Step 02 — Doctor & patient assigning:",
            [
              "Search / select an existing patient",
              "Register a new patient when required",
              "Select the appropriate doctor",
              "Schedule the appointment",
            ],
          ],
          why: "Separating appointment details from patient / doctor assignment prevents the workflow from becoming one large administrative form.",
        },
        {
          title: "Doctors",
          text: [
            "The same appointment system from a more focused perspective:",
            [
              "Current availability",
              "Next appointment",
              "Appointment date / time",
              "Patient",
              "Appointment type",
              "Appointment status",
              "Relevant appointment details / actions",
            ],
          ],
          why: "Doctors need their clinical schedule and patient context, not the entire clinic's administrative dashboard.",
        },
      ],
      // IMAGES (CMS): one annotated screen per role, in the order of the
      // principles above. Each is the first 1920 × 1080 of a Figma frame
      // (Cetasika-App 24988:13716 admin, 24988:14089 queue, 24988:14530
      // doctor) at 2×. The admin and queue frames' sidebar panel stops short
      // in Figma; it's carried down to the bottom of the crop.
      media: [
        {
          layout: "annotated",
          caption: "Main Admin: the whole clinic at a glance.",
          image: shot(
            "decisions/05-admin-dashboard.webp",
            "Clinic CMS — Main Admin dashboard",
            "The Clinic Management dashboard for the main admin: today's appointments, patients and revenue, and visits this month; revenue and patient-visit charts; today's appointments with Upcoming, In Consultation, Waiting, Completed and Cancelled counts; and the live queue. The sidebar includes Doctors, Receptionists, Billing and Settings.",
          ),
          markers: [
            { n: 1, box: [572, 346, 3788, 634] },
            { n: 2, box: [572, 1472, 3788, 2156] },
            { n: 3, box: [36, 182, 484, 1126] },
          ],
          notes: [
            "Clinic-wide numbers first: appointments and patients today, today's revenue and this month's visits.",
            "Today's appointments by status, beside the live queue with each patient's token, doctor and status.",
            "The admin's menu also runs the clinic itself: doctors, receptionists, billing and settings.",
          ],
        },
        {
          layout: "annotated",
          caption: "Queue: one board that moves every patient through the day.",
          image: shot(
            "decisions/05-queue-board.webp",
            "Clinic CMS — Queue board",
            "The Queue board: counts for today's patients, waiting, in consultation and completed; filters for date, doctor, branch, department and status; columns for Booked, Checked In, Waiting, In Consultation and Completed, with patient cards showing time, token, doctor and visit type, one tagged Through Cetasika; and a card menu open on Move to, listing Checked-in, Waiting, In Consultation and Completed.",
          ),
          markers: [
            { n: 1, box: [540, 888, 3788, 972] },
            { n: 2, box: [1196, 1672, 1970, 2044] },
            { n: 3, box: [2506, 1298, 3144, 1682] },
          ],
          notes: [
            "One board for the day: patients move from Booked to Checked In, Waiting, In Consultation and Completed, with a count at each stage.",
            "Staff move a patient to the next stage from the card's menu.",
            "Bookings made in the Cetasika app join the same queue, and keep their Through Cetasika tag at every stage.",
          ],
        },
        {
          layout: "annotated",
          caption: "Doctors: their own day, without the clinic's administration.",
          image: shot(
            "decisions/05-doctor-dashboard.webp",
            "Clinic CMS — Doctor dashboard",
            "The doctor's dashboard for Dr. Sarah Johnson: a banner to integrate with the Cetasika app; counts for today's appointments, patients, prescriptions and completed appointments; today's schedule with each patient's time, reason, status and time until the appointment; and a calendar. The sidebar has no Doctors or Receptionists items.",
          ),
          markers: [
            { n: 1, box: [36, 182, 484, 910] },
            { n: 2, box: [588, 1142, 3004, 2156] },
            { n: 3, box: [552, 222, 3812, 742] },
          ],
          notes: [
            "A doctor's menu leaves out clinic administration, such as managing doctors and receptionists.",
            "Their own day as a schedule: each patient's time, reason for the visit, status and how long until it starts.",
            "A prompt to connect their Cetasika app account, so appointments, patients and prescriptions stay in sync.",
          ],
        },
      ],
      impact: [
        [
          "Creates one connected clinic workflow",
          "Gives Main Admin clinic-wide visibility",
          "Makes manual scheduling clearer for staff",
          "Gives Doctors a focused appointment experience",
          "Keeps appointment data consistent from creation to consultation",
          "Reduces dependence on disconnected administrative processes",
        ],
      ],
    },
  ],

  // ------------------------------------------------------------ 03 Solution
  // One overview of the app and the clinic CMS, then two image boxes.
  // (Uses the `operations` section layout: body, groups, then media.)
  operations: {
    body: [
      "Cetasika brings patients, providers and clinics into one connected product: a mobile app where patients find and book care and providers run their services, and a Clinic Management CMS where clinics run their day-to-day operations.",
      "Both sides share the same appointment information — what a doctor, centre or clinic sets up is what a patient can find, book and manage.",
    ],
    groups: [
      {
        title: "Cetasika app",
        text: [
          "Need-led discovery",
          "Doctor and centre profiles",
          "Booking and payment",
          "My Appointments",
          "Provider registration",
          "Services and packages",
          "Availability and slots",
        ],
      },
      {
        title: "Clinic Management CMS",
        text: ["Admin dashboard", "Live queue", "Appointments", "Patients", "Doctors and staff", "Prescriptions", "Billing"],
      },
    ],
    // IMAGES: two compositions side by side (exported at 3840px for HD).
    media: {
      layout: "two-up",
      images: [
        image(`${dir}/solution/app-01.webp`, {
          size: "wide",
          quality: 90,
          label: "Cetasika app — Book Appointment",
          alt: "A phone held in two hands showing Book Appointment for Dr. Sarika Sharma: video or in-clinic consult, clinic location, consultation fee and a date picker",
        }),
        image(`${dir}/solution/app-02.webp`, {
          size: "wide",
          quality: 90,
          label: "Cetasika app and Clinic Management CMS",
          alt: "The app's specialist picker and Find Doctors list on two phones, either side of the Clinic Management CMS doctor dashboard with today's schedule and calendar",
        }),
      ],
    },
  },

  // ------------------------------------------------------- 05 Design system
  designSystem: {
    body: "Cetasika needed consistency across very different workflows without making every surface identical.",
    platforms: [
      {
        name: "Consumer App patterns",
        detail: [
          "Provider cards",
          "Centre cards",
          "Appointment cards",
          "Inputs",
          "Filters",
          "Status chips",
          "Slots",
          "Packages",
          "Payments",
        ],
      },
      {
        name: "CMS patterns",
        detail: [
          "Forms",
          "Tables",
          "Availability",
          "Service management",
          "Appointment states",
          "Business configuration",
        ],
      },
    ],
    principle: "One interaction language, adapted to different contexts.",
    visualLanguage: {
      title: "Calm, not clinical.",
      body: [
        "Healthcare interfaces can feel sterile, while wellness products can feel overly lifestyle-driven.",
        "Cetasika needed to feel credible enough for healthcare while remaining approachable for everyday wellbeing.",
      ],
      colors: [
        {
          hex: "#1FA3AC",
          name: "Primary Teal",
          rationale: "Used for headings, selected states, icons, labels, and core brand accents.",
        },
        {
          hex: "#27696D",
          name: "Deep Teal",
          rationale: "Used for stronger text, borders, darker brand emphasis, and secondary actions.",
        },
        {
          hex: "#FE7E01",
          name: "CTA Orange",
          rationale: "Used for the strongest actions like Pay, Subscribe, Upgrade, and other high-priority CTAs.",
        },
        {
          hex: "#E6F4FD",
          name: "Soft Aqua / Ice Blue",
          rationale: "Used for headers, cards, soft backgrounds, and calm supporting surfaces.",
        },
      ],
    },
  },

  // -------------------------------------------------------------- 06 Website
  website: {
    body: "While the App and CMS prioritise task completion, the Cetasika website needed to explain the larger healthcare and wellness ecosystem and create a stronger emotional first impression.",
    contrast: [
      { title: "Product UI", text: ["Functional", "Predictable", "Efficient", "Information-driven"] },
      { title: "Website", text: ["Story-driven", "Expressive", "Motion-led", "Brand-focused"] },
    ],
    journey: [
      "Hero storytelling",
      "Future of Health",
      "Health Journey",
      "App / CMS solutions",
      "Digital foundation",
      "Call to action",
    ],
    // IMAGE: one composition of the website (exported at 3840px for HD).
    media: {
      layout: "full",
      image: image(`${dir}/website/overview.webp`, {
        size: "wide",
        quality: 90,
        label: "Website experience overview",
        alt: "The Cetasika website, designed and developed: the hero “India's Intelligent Wellness & Digital Healthcare App” on a desktop, flanked by the “Health Care That Fits Everyone” section and the Purpose-Built Solutions section introducing Cetasika Clinic",
      }),
    },
    link: { href: "https://www.cetasika.com", label: "www.cetasika.com" },
    note: "I also used AI-assisted React / Next.js and GSAP workflows to bring parts of the design closer to implementation while collaborating with frontend engineering.",
  },

  // -------------------------------------------------------------- 07 Outcome
  // Product and design outcomes only — no invented metrics.
  outcomes: {
    points: [
      "Simplified five roles into three scalable user types.",
      "Removed duplicate centre presentation.",
      "Created reusable discovery and booking patterns.",
      "Connected Consumer App and CMS through one product system.",
    ],
    learning: {
      title: "What I learned",
      body: [
        "The hardest part wasn't designing individual screens. It was deciding what should remain consistent as the product expanded.",
        "Cetasika taught me that scalable UX often starts by simplifying the underlying product model before simplifying the interface.",
      ],
    },
  },
};

export default cetasika;
