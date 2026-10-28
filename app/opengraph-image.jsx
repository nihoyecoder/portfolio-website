import { homeImage, ogSize, ogType } from "@/lib/og";

// Link preview for the home page (see lib/og.jsx).
export const alt = "Manoj Rawat — AI Product Designer";
export const size = ogSize;
export const contentType = ogType;

export default function Image() {
  return homeImage();
}
