// Cetasika — the first full case study, and the reference for the others.
//
// Title, category, colours and the Selected Work visuals come from
// data/projects.js. Everything below is case-study content; any section can
// be removed (or set to null) and the page skips it. Copy fields can be a
// string or a list of paragraphs; "\n" forces a line break in a heading.
//
// Kept deliberately short (a 3–5 minute read): problem and users, six
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

  meta: [
    { label: "Year", value: "2025–2026" },
    { label: "Role", value: "UI/UX Lead" },
    { label: "Platforms", value: "Consumer App · CMS · Website" },
    {
      label: "My contribution",
      value: [
        "Product Strategy",
        "UX Architecture",
        "UX/UI Design",
        "Design System",
        "Prototyping",
        "Frontend Collaboration",
      ],
    },
  ],

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
        "Users don't always know which provider category they need.",
        "Someone may know they have back pain, need help with a skin concern or want prenatal yoga without knowing how Cetasika internally classifies that care.",
      ],
      decision: [
        "Structure discovery around:",
        // A nested list renders inline ("a · b · c") and reads as a list.
        ["Specialties", "Conditions", "Services", "Location", "Consultation type"],
      ],
      why: "The interface should follow the user's mental model instead of expecting users to understand Cetasika's internal provider structure.",
      // IMAGE: one composition of the four steps from home to a provider.
      media: {
        layout: "full",
        caption: "Home → Wellness centres → Centre services → Provider",
        image: image(`${dir}/decisions/01-discovery.webp`, {
          size: "wide",
          quality: 90,
          label: "Need-led discovery flow",
          alt: "Four app screens: the patient home with wellness categories, a list of therapeutic yoga centres, a centre's services with prices, and a studio page for choosing a service and location before requesting an appointment",
        }),
      },
      impact:
        "Users can begin with what they know — their need — and progressively reach the right doctor, centre or service.",
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
      // IMAGE: one composition of provider registration (exported at 3840px for HD).
      media: {
        layout: "full",
        caption: "Who are you registering as → How you provide services → Wellness category",
        image: image(`${dir}/decisions/02-registration.webp`, {
          size: "wide",
          quality: 90,
          label: "Provider registration flow",
          alt: "Three registration screens: choosing between CetaUsers, Doctors and Holistic Wellness; choosing Wellness Center or Individual Wellness Provider; and selecting a wellness category such as Massage & Spa",
        }),
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
        ["Reschedule", "Cancel", "Proceed to Pay", "Get Directions", "Session OTP"],
      ],
      why: [
        "Doctor approval, payment and the actual appointment are separate parts of the same journey.",
        "Users should never have to guess whether the booking is confirmed or what action is expected from them next.",
      ],
      // IMAGE: one composition of the existing UI (exported at 3840px for HD).
      media: {
        layout: "full",
        caption:
          "Every state answers three questions: where am I, what happened, and what do I need to do next?",
        image: image(`${dir}/decisions/03-booking-states.webp`, {
          size: "wide",
          quality: 90,
          label: "Booking states — approval, payment and confirmation",
          alt: "Three app screens: a payment summary with the fee breakdown, total payable, refund information and Slide to Pay; a Payment Successful confirmation with status, date, time, payment method and receipt; and My Appointments showing Pending Approval and Booking Approved bookings with Reschedule, Cancel and Proceed to Pay actions",
        }),
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
      // IMAGE: one composition of the availability flow (exported at 3840px for HD).
      media: {
        layout: "full",
        caption: "Set availability → See slots by date → Manage individual slots",
        image: image(`${dir}/decisions/04-doctor-availability.webp`, {
          size: "wide",
          quality: 90,
          label: "Doctor availability — flexible slot management",
          alt: "Three Availability and Slots screens: setting a location, appointment type, date, start and end time, slot duration, buffer and weekly repeat; schedules listed by date for each clinic; and one schedule expanded to tick individual 15-minute slots on or off",
        }),
      },
      impact:
        "More realistic scheduling, greater flexibility and control for providers, and support for doctors with different consulting patterns.",
    },
    {
      // A designed future monetisation model — not a released feature. Keep
      // the copy in that tense until it ships.
      title: "Design subscription as a lifecycle, not just a paywall.",
      status: "Designed · not yet released",
      context: [
        "Cetasika explored a subscription model for Doctors and Wellness Centres, designed as a future monetisation model for providers.",
        "The core provider experience stays available through a free plan, while advanced capabilities can be offered through a paid Cetasika subscription.",
      ],
      problem: [
        "Introducing a subscription required more than designing an upgrade screen. Providers needed to understand:",
        [
          "What remains free",
          "What paid plans unlock",
          "Why upgrading is useful",
          "Their current subscription status",
          "Renewal date and pricing",
          "How to cancel",
          "What happens if automatic renewal fails",
          "What happens to an active subscription when deleting an account",
        ],
        "A subscription experience that only handles purchase would leave important lifecycle and edge cases unresolved.",
      ],
      decision: [
        "Design the subscription as a complete lifecycle:",
        "Discover → Compare → Upgrade → Activate → Manage → Renew / Recover → Cancel",
        "Keep the core product accessible through a free plan, then clearly communicate the additional value of the paid plan — for both Doctors and Wellness Centres, with benefits relevant to each.",
      ],
      why: [
        "Subscription is an ongoing relationship, not a single transaction.",
        "The experience therefore needs transparency before purchase, confirmation after purchase, ongoing management and clear recovery for exceptional states.",
      ],
      // Benefit names follow the latest design (e.g. "Unlimited Slots").
      principles: [
        {
          title: "Explain value before payment",
          text: [
            "Allow providers to compare free and paid capabilities before choosing a plan. Examples explored for Doctors:",
            [
              "Video Consultation",
              "Prescription Upload",
              "Unlimited Slots",
              "Unlimited Chats",
              "Multi-location Support",
              "Priority Support",
              "Verified Badge",
              "Personalised Profile Video",
              "Access to New Features",
              "Boosted Visibility",
              "Sharing and Promotion",
            ],
            "For Centres, operational benefits:",
            [
              "Additional services",
              "Additional packages",
              "Unlimited chats",
              "Multi-location support",
              "Priority support",
              "Verified status",
              "Access to new features",
              "Boosted visibility",
              "Sharing and promotion",
            ],
          ],
        },
        {
          title: "Surface upgrades contextually",
          text: "The provider dashboard can communicate the availability of Cetasika Plus and let providers upgrade when the additional capability is relevant.",
          principle: "Promote the upgrade where users can understand why it matters.",
        },
        {
          title: "Close the purchase loop",
          text: [
            "After a successful subscription, clearly communicate:",
            ["Subscription activation", "Current plan", "Next billing date"],
            "Providers should never be left unsure whether the upgrade succeeded.",
          ],
        },
        {
          title: "Give users control after subscribing",
          text: [
            "My Subscription clearly shows:",
            ["Current Plan", "Status", "Renewal Date", "Price", "Cancellation action"],
          ],
          principle: "Recurring payments need recurring visibility and control.",
        },
        {
          title: "Treat failed renewal as a recoverable state",
          text: [
            "If automatic payment fails, a dedicated paused / payment-failure state explains:",
            [
              "The payment did not go through",
              "The system will retry",
              "Check balance / payment details",
              "Manage Subscription is available",
            ],
          ],
          principle: "Payment failure should explain what happened and how to recover.",
        },
        {
          title: "Resolve subscription before account deletion",
          text: [
            "If a provider tries to delete their account while a subscription is active, they manage or cancel the subscription first. The screen shows:",
            ["Current plan", "Active status", "Renewal date", "Price", "Manage Subscription", "Back to Profile"],
            "The subscription remains active until the end of the current billing period.",
          ],
          principle: "Account deletion should not silently break an active billing relationship.",
        },
      ],
      // IMAGE: one composition of the existing UI (exported at 3840px for HD).
      media: {
        layout: "full",
        caption:
          "Subscription was designed as an ongoing provider relationship — from understanding the value to managing renewal, failure and cancellation.",
        image: image(`${dir}/decisions/05-subscription.webp`, {
          size: "wide",
          quality: 90,
          label: "Cetasika subscription — compare, upgrade and recover",
          alt: "Three provider screens: a Cetasika subscription comparison of the Free and Plus plans with features such as Video Consultation, Unlimited Slots and Priority Support; a centre dashboard with a Grow Your Center with Cetasika PLUS upgrade module; and a Subscription Paused message explaining the payment didn't go through, with Manage Subscription",
        }),
      },
      // Intended outcomes of the design — not measured results.
      impact: [
        "Designed to:",
        [
          "Make free vs paid value easier to understand",
          "Give providers control over recurring billing",
          "Create clearer upgrade opportunities",
          "Handle failed renewal without leaving users confused",
          "Prevent account deletion from conflicting with an active subscription",
          "Create a reusable monetisation model for both Doctors and Wellness Centres",
        ],
      ],
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
      // IMAGE (CMS): one composition of the clinic CMS (exported at 3840px for HD).
      media: {
        layout: "full",
        caption:
          "One appointment system connects Admin, Staff and Doctors while giving each role only the context they need.",
        image: image(`${dir}/decisions/06-clinic-appointments.webp`, {
          size: "wide",
          quality: 90,
          label: "Clinic Management System — Admin, Queue and Doctor views",
          alt: "The Cetasika Clinic Management System on three devices: the Queue board with Booked, Checked In, Waiting, In Consultation and Completed patients; a Doctor dashboard with today's schedule and calendar; and the Admin dashboard with total appointments, patients today, revenue, total visits, today's appointments and the live queue",
        }),
      },
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
