import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/data/profile";

// Link-preview images (Open Graph / Twitter), rendered with next/og at build
// time: the home card (app/opengraph-image.jsx) and one per case study
// (app/work/[slug]/opengraph-image.jsx). Same fonts and colours as the site.

export const ogSize = { width: 1200, height: 630 };
export const ogType = "image/png";

const HOME = { background: "#f2ecec", text: "#27242f", accent: "#c4546a", muted: "#6f6a72" };

// next/og needs TTF/OTF; Google Fonts serves TTF to a plain request, and
// `text` trims the file to the glyphs used. On a network failure the image
// still renders (in the default font) instead of failing the build.
async function googleFont(family, weight, text, italic = false) {
  try {
    const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:${axis}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const file = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!file) return null;
    return { name: family, data: await (await fetch(file)).arrayBuffer(), weight, style: italic ? "italic" : "normal" };
  } catch {
    return null;
  }
}

async function fonts({ sans, mono }) {
  const list = await Promise.all([googleFont("Manrope", 600, sans), googleFont("Geist Mono", 500, mono)]);
  return list.filter(Boolean);
}

const logo = readFile(join(process.cwd(), "public/brand/manoj-logo.png")).then(
  (data) => `data:image/png;base64,${data.toString("base64")}`,
  () => null,
);

// One line of mono caps: a label or a fact.
function Line({ text, color, size = 22 }) {
  if (!text) return null;
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Geist Mono",
        fontSize: size,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color,
      }}
    >
      {text}
    </div>
  );
}

function Frame({ background, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "56px 64px",
        background,
        fontFamily: "Manrope",
      }}
    >
      {children}
    </div>
  );
}

// Home: the name in rose, the role, the current job.
export async function homeImage() {
  const name = "MANOJ RAWAT";
  const role = profile.role;
  const proof = `Currently ${profile.current.title} at ${profile.current.company}`;
  const footer = "Portfolio · Case studies";
  const src = await logo;

  return new ImageResponse(
    (
      <Frame background={HOME.background}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
          {src ? <img src={src} height={56} alt="" /> : <div />}
          <Line text={footer} color={HOME.muted} size={20} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 158, lineHeight: 0.86, letterSpacing: "-0.055em", color: HOME.accent }}>{name}</div>
          <div style={{ marginTop: 28, fontSize: 52, letterSpacing: "-0.035em", color: HOME.text }}>{role}</div>
        </div>
        <Line text={proof} color={HOME.text} />
      </Frame>
    ),
    { ...ogSize, fonts: await fonts({ sans: name + role, mono: footer + proof }) },
  );
}

// A case study: the project's own colours, title, what it is and its status.
export async function caseImage(project) {
  const title = project.title;
  const tag = project.tag ?? project.subtitle;
  const status = project.status;
  const by = "Case study · Manoj Rawat, Product Designer";

  return new ImageResponse(
    (
      <Frame background={project.background}>
        <Line text={by} color={project.foreground} size={20} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Line text={tag} color={project.foreground} size={24} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 24,
              fontSize: title.length > 12 ? 112 : 150,
              lineHeight: 0.92,
              letterSpacing: "-0.055em",
              color: project.accent,
            }}
          >
            {/* Same line breaks as the Selected Work card. */}
            {(project.titleLines ?? [title]).map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
        <Line text={status} color={project.foreground} />
      </Frame>
    ),
    { ...ogSize, fonts: await fonts({ sans: title, mono: by + tag + status }) },
  );
}
