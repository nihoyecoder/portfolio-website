// 1EV — making electric mobility simpler.
//
// Source: 1EV_Product_Design_Complete_Documentation_for_Claude.md and the
// 16 authentic dark-theme app screens ("1EV Design File (19)"). Nothing here
// claims research, metrics or launch status. 1EV Care requirements come from
// the Care MVP specification by Komal Sankapal — credit it; the work shown is
// the customer-facing design.
//
// Real screens live in /images/projects/1ev/case-study/screens (750 × 1624:
// a 375 × 812 viewport at 2×, top-cropped) and details/ (close-ups of real
// UI). Booking, charging-status and 1EV Care screens are exported from the
// 1EV Figma file (U13s87YQlIryNqJjYEh1jf): Slot Booking 2254:1457, Booking
// Successful 3284:213, interrupted 7365:6644, Session Details 7357:4978,
// Care home 7697:11210, recommended centre 7661:6471, technician 7815:2518,
// service slot 7661:8701, roadside problem 7768:769, and the charging-type
// selector variants 2982:139 / 2982:138 / 3233:606.
// Colours with a `token` are that file's variables; #010518 is the splash
// background from the documentation.

import { image } from "@/lib/case-study";

const dir = "/images/projects/1ev/case-study";
// At the files' real size (750 × 1624), so a screen's `markers` boxes
// ([x1, y1, x2, y2]) are in its own pixels.
const screen = (name, label, alt, extra = {}) => ({
  ...image(`${dir}/screens/${name}.webp`, { size: "phone", quality: 90, label, alt }),
  width: 750,
  height: 1624,
  ...extra,
});
const detail = (name, label, alt, caption) => ({
  ...image(`${dir}/details/${name}.webp`, { size: "panel", quality: 90, label, alt }),
  caption,
});

// Problem → Design decision → UX reasoning → User benefit.
const labels = { decision: "Design decision", why: "UX reasoning", impact: "User benefit" };

const oneEv = {
  // Light page; deep-navy stages and sections carry the dark product UI.
  theme: {
    background: "#EEF2F2",
    text: "#0B1222",
    line: "#CFD8DA",
    surface: "#010518",
    accent: "#0A8783",
    stage: "#010518",
    stageText: "#E6F4F7",
    dark: { background: "#010518", text: "#E6F4F7", line: "rgb(255 255 255 / 0.12)", canvas: "#0A1430" },
  },
  tones: { designSystem: "dark", showcase: "dark" },
  navLabels: { showcase: "Product" },

  // ------------------------------------------------------------------ Hero
  category: "EV Charging & Mobility Ecosystem",
  summary: "Making electric mobility simpler.",
  subheadline:
    "Designing intuitive charging, vehicle care and assistance experiences within one connected EV ecosystem.",
  // Professional context (components/case-study/CaseStudyMeta). Not marked
  // 0→1 and no launch status: neither is recorded for 1EV.
  context: {
    company: "MFD (Meta For Data Technologies)",
    role: "Product Designer · UX/UI Lead",
    team: "Care requirements by Komal Sankapal (Care MVP spec)",
    platforms: "Consumer mobile app",
    ownership: [
      "UX strategy & user flows",
      "Information architecture",
      "Interaction & visual design",
      "Design system & prototyping",
      "Developer handoff",
    ],
  },
  // IMAGE: one composition of three phones (exported at 3840px for HD).
  hero: image(`${dir}/hero/charging-trio.webp`, {
    size: "wide",
    quality: 90,
    label: "1EV · Station, live charging and session details",
    alt: "Three phones showing 1EV on a deep teal background: station details with Check In, a live charging session at 68%, and the completed session details with a ₹496 total, the centre phone held in a hand",
  }),

  labels: {
    challenge: "The challenge",
    decisions: "Key UX decisions",
    designSystem: "Visual identity",
    outcomes: "Outcome & reflection",
  },
  headings: {
    decisions: "Three problems, three decisions.",
    designSystem: "One dark visual language, end to end.",
    outcomes: "What the design set out to change.",
  },

  // ------------------------------------------------------------- Challenge
  challenge: {
    statement: "EV ownership comes with decisions most drivers have never had to make.",
    body: "Charging asks people to think in kWh, judge unfamiliar stations and trust sessions that can stop without warning. Servicing an EV is fragmented, and a breakdown is time-critical. Each moment carries uncertainty — about cost, progress or what to do next. The challenge was to make them predictable without hiding the complexity underneath.",
    hmw: "How might we make EV charging and vehicle care simpler, more predictable and easier to navigate?",
    journey: {
      title: "Three journeys, three speeds",
      lanes: [
        {
          title: "Charge",
          tag: "Now or soon",
          steps: ["Find a station", "Choose kWh or ₹", "Book a slot", "Charge live", "Recover or rebook"],
        },
        {
          title: "Book a service",
          tag: "Planned",
          steps: ["Choose a service", "Compare providers", "Book", "Track the job"],
        },
        {
          title: "Get help",
          tag: "Urgent",
          steps: ["Describe the problem", "Share location", "Track the technician"],
        },
      ],
    },
  },

  // ------------------------------------------------------------- Decisions
  decisions: [
    {
      labels,
      title: "Simplifying charging decisions.",
      problem:
        "Some drivers know the energy they need; others only know what they want to spend. Asking everyone for kWh forces mental maths.",
      decision:
        "Three ways to say how much: by kWh, by battery percentage or by ₹ budget. Each mode estimates what's missing — time, percentage or units — and all three lead to the same slot choice, an estimated price before review, and a booking summary.",
      why: "Match the interaction to the user's mental model, and show the estimate before commitment.",
      media: [
        {
          layout: "phones",
          caption: "Slot booking with an estimated price before Review Booking · the booking summary that follows",
          images: [
            screen("booking-by-unit", "Slot Booking — By Unit", "Slot Booking: select your EV, charging type By Unit with an Enter Units field, estimated time 45 mins and 56%, slot selection, and a Booking Preview with an estimated price of ₹5000 and Review Booking", {
              markers: [
                { n: 1, box: [28, 540, 700, 710] },
                { n: 2, box: [62, 875, 690, 1008] },
                { n: 3, box: [0, 1372, 740, 1592] },
              ],
            }),
            screen("booking-summary", "Booking Successful", "Booking Successful: a summary with station, date and time, vehicle and booking ID, Download Receipt, next steps, and Done", {
              markers: [
                { n: 4, box: [28, 418, 722, 950] },
                { n: 5, box: [28, 980, 722, 1295] },
              ],
            }),
          ],
          notes: [
            "Three ways to say how much: by unit (kWh), by battery percentage or by price.",
            "Each mode estimates what's missing: here, the time and battery percentage for a kWh amount.",
            "The estimated price stays in view before Review Booking.",
            "The summary confirms station, time, vehicle and booking ID, with the receipt to download.",
            "Next steps say what to do on the day: arrive 15 minutes early, and pay the rest at the station.",
          ],
        },
        // The selector's three states, from the component set (they only
        // exist there; every booking screen in the file shows By Unit).
        {
          layout: "full",
          caption: "The charging-type selector's three states, from the component set: By Unit, By Percentage and By Price.",
          image: {
            src: `${dir}/details/booking-modes.webp`,
            width: 3300,
            height: 1026,
            quality: 90,
            label: "Charging type — three modes",
            alt: "Three variants of Select Charging Type: By Unit with estimated time and percentage, By Percentage with estimated time and units, and By Price with estimated time and units",
          },
        },
      ],
      impact: "Drivers plan a charge in the terms they already think in — and see what they'll pay before they pay it.",
    },
    {
      labels,
      title: "Making charging progress and failures understandable.",
      problem:
        "A live session is a black box, and an interruption is a high-anxiety moment: did it stop, was I charged, what now?",
      decision:
        "Explicit session states — starting, live, completed, interrupted — with energy, cost and time remaining, a clear payment summary, and recovery actions such as Try Again or Find Another Charger.",
      why: "Visibility of system status, meaningful feedback and a way out of every failure.",
      media: {
        layout: "sequence",
        images: [
          screen("charging-session", "Live charging session", "Live session: Charging Normally, 14.6 kWh delivered, 68%, current power 47 kW, cost ₹286, 32 min, about 18 min remaining", {
            title: "Live session",
            caption: "Energy, cost and time remaining at a glance",
            markers: [
              { n: 1, box: [40, 490, 710, 900] },
              { n: 2, box: [55, 968, 695, 1265] },
            ],
          }),
          screen("session-interrupted", "Charging interrupted", "Charging interrupted: your charging session stopped unexpectedly, reconnecting with a 00:18 timer, Try Again, Report an issue and Need help", {
            title: "Interrupted",
            caption: "What happened, a reconnect in progress, and Try Again",
            markers: [
              { n: 3, box: [25, 495, 725, 990] },
              { n: 4, box: [15, 1015, 735, 1225] },
            ],
          }),
          screen("session-completed", "Session details", "Session Details: charge completed, 24.8 kWh delivered, duration, average power, charging cost ₹486, platform fee ₹10, total ₹496, the station and View Receipt", {
            title: "Completed",
            caption: "Energy, cost, platform fee and total — then the receipt",
            markers: [{ n: 5, box: [22, 940, 728, 1222] }],
          }),
        ],
        notes: [
          "A live status with energy delivered and a progress bar: the session is never a black box.",
          "Power, cost so far, time charging and time remaining, side by side.",
          "An interruption says what happened, and shows the reconnect in progress.",
          "A way out: Try Again first, then Report an issue or Need help.",
          "The completed session lists charging cost and platform fee before the total, then the receipt.",
        ],
      },
      impact: "Drivers always know what the charger is doing, what it has cost, and what to do if it stops.",
    },
    {
      labels,
      title: "Making vehicle care and assistance easier.",
      context:
        "1EV Care's requirements come from the Care MVP specification by Komal Sankapal. I designed the customer-facing experience.",
      problem:
        "Routine servicing and a roadside breakdown are different jobs — one planned and comparative, the other urgent. One generic flow fails both.",
      decision:
        "1EV Care split into two journeys — Book a service and Get help on the road — with contextual service selection, one recommended provider you can accept or swap, live technician tracking and cancellation.",
      why: "Progressive disclosure, fewer decisions under stress, and urgent actions given priority.",
      media: {
        layout: "sequence",
        images: [
          screen("care-home", "1EV Care — Home", "1EV Care home: select your EV, Need help on the road with four quick roadside actions, and Services below", {
            title: "Care Home",
            caption: "Help on the road first; planned services below",
            markers: [{ n: 1, box: [25, 935, 725, 1270] }],
          }),
          screen("care-providers", "1EV Care — Recommended centre", "Service Centre: we found the best match for your issue — EV Care Diagnostics, 4.8 rating, 3.2 km away, fits your XEV 9e, from ₹599, next available today 5:30 PM, Accept This Centre or Show Me Another Option", {
            title: "Recommended centre",
            caption: "One best-fit match — accept it, or see another",
            markers: [
              { n: 2, box: [22, 232, 728, 530] },
              { n: 3, box: [0, 962, 748, 1322] },
              { n: 4, box: [12, 1345, 738, 1565] },
            ],
          }),
          screen("care-technician-tracking", "Roadside — Technician on the way", "Technician is on the way: live map with a 12 min ETA, arrival OTP, the verified roadside partner, and Call, Message and Share Trip", {
            title: "Track help",
            caption: "Who is coming, when, and how to verify them",
            markers: [
              { n: 5, box: [10, 355, 740, 782] },
              { n: 6, box: [10, 795, 740, 1298] },
            ],
          }),
        ],
        notes: [
          "Help on the road comes first: four large tiles for the common problems, above planned services.",
          "One recommendation, with the reason: the vehicle, the reported issue, location and the centre's capabilities.",
          "The facts that decide it: rating, distance, fit for the vehicle, price and the next available slot.",
          "Accept it in one tap, or ask for another option instead of comparing a long list.",
          "Live tracking with the technician's arrival time and distance.",
          "An arrival OTP and a verified partner card: who is coming, and how to check it's them.",
        ],
      },
      impact: "Planned care feels considered; getting help takes as few decisions as possible.",
    },
  ],

  // --------------------------------------------------------- Design system
  designSystem: {
    body: "The same dark interface language runs through charging, wallet and 1EV Care, so new modules feel like one product.",
    visualLanguage: {
      title: "Dark, calm and high-contrast.",
      body: [
        "1EV is dark-only: deep navy surfaces, high-contrast text and an electric teal kept for primary actions and live states.",
        "Status always pairs colour with a label and an icon — never colour alone.",
      ],
      colors: [
        { hex: "#010518", name: "Ink Navy", rationale: "The app background — every screen starts from it." },
        { hex: "#00C6BD", name: "1EV Teal", token: "Color/Primary/60", rationale: "Primary actions — the full-width pill — and live states." },
        { hex: "#A8CFFE", name: "Ice Blue", token: "Color/Primary/99", rationale: "Icon accents and selected chips, like the charging-type icons." },
        { hex: "#FFFBFE", name: "Text White", token: "Color/Neutral/99", rationale: "Primary text — high contrast on every navy surface." },
        { hex: "#FF9500", name: "Orange", token: "Colors/Orange", rationale: "Interruptions and states that need attention." },
        { hex: "#B3261E", name: "Error Red", token: "Color/Error/40", rationale: "Danger only — like Call 112 in roadside help." },
      ],
      specs: [
        { name: "Typography", value: "Urbanist", rationale: "Semibold headings and regular body text, high-contrast on navy and readable at small sizes." },
        { name: "Buttons", value: "Full-width teal pill; outlined pill for secondary", rationale: "One obvious next step per screen." },
        { name: "Cards & sheets", value: "Gradient surfaces, 1 px borders, 16–24 px radii", rationale: "Groups information without heavy dividers." },
        { name: "Status", value: "Colour + label + icon", rationale: "Live, Available, Unavailable and Paid stay readable without colour." },
        { name: "Touch targets", value: "≥ 48 dp; ≥ 56 dp for roadside help", rationale: "Larger targets where people act under stress (Care spec)." },
        { name: "Consistency", value: "Shared cards, chips, tabs and CTAs", rationale: "Charging and Care reuse components; urgent Help gets its own." },
      ],
    },
    media: [
      // UI close-ups from the real screens.
      {
        layout: "three-up",
        images: [
          detail("primary-cta", "Primary action", "The full-width teal Continue pill", "Primary action — full-width pill"),
          detail("station-card", "Station card", "Station card with name, address, distance, power and availability", "Station card — scannable at a glance"),
          detail("filter-chips", "Filter chips", "Filter chips for charger type and charging speed", "Filter chips — selected vs available"),
          detail("live-session", "Live status", "Live status chip, energy delivered and progress bar", "Live status — label, value, progress"),
          detail("booking-tabs", "Booking tabs", "Upcoming, Completed and Canceled tabs with a booking card and Cancel / Navigate", "Tabs and booking card — state-first"),
          detail("wallet-balance", "Wallet and Evoins", "Wallet balance and Evoins balance with Add Money and Redeem Evoins", "Wallet vs Evoins — kept distinct"),
        ],
      },
    ],
  },

  // -------------------------------------------------------------- Showcase
  showcase: {
    media: [
      {
        layout: "phones",
        caption: "Station discovery and charger details",
        images: [
          screen("dashboard", "Charger map", "Map of nearby charging stations"),
          screen("list-view", "List view", "List of charging stations with distance, power and availability"),
          screen("station-details", "Station details", "Station details with 1EV Score, photos, price and plugs"),
        ],
      },
      {
        layout: "phones",
        caption: "Bookings, trips and wallet",
        images: [
          screen("upcoming-bookings", "My Slots — Upcoming", "Upcoming bookings with Cancel and Navigate"),
          screen("trips", "Trips", "Trip planning with vehicle, start, destination and remaining range"),
          screen("wallet", "Wallet", "Wallet and Evoins balances with recent activity"),
        ],
      },
      {
        layout: "phones",
        caption: "1EV Care and roadside assistance",
        images: [
          screen("care-service-booking", "1EV Care — Choose a slot", "Choose a date and an available slot at EV Care Diagnostics, with the selected slot held for 09:42"),
          screen("rsa-problem", "Roadside assistance — What's the problem?", "Road Side Assistance step 1 of 3: Call 112 if in immediate danger, then large tiles such as EV Won't Start, Battery Depleted and Flat Tyre"),
          screen("care-technician-tracking", "Roadside assistance — Live tracking", "Technician is on the way, with a live map, ETA and arrival OTP"),
        ],
      },
    ],
  },

  // --------------------------------------------------------------- Outcome
  // Intended outcomes of the design — no measured results exist yet.
  outcomes: {
    body: "These are the intended outcomes of the design work, not measured results.",
    points: [
      "More understandable charging decisions.",
      "Transparent pricing and progress.",
      "Clear paths through errors and exceptions.",
      "Routine and emergency journeys kept apart.",
      "Consistent interactions across the ecosystem.",
    ],
    learning: {
      title: "What I learned",
      body: "Connected products are tested at their seams — when a charge stops, a quote changes or someone needs help. Designing those edge states first made the everyday paths simpler too.",
    },
  },
};

export default oneEv;
