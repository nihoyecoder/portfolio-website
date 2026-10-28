import { homeImage, ogSize, ogType } from "@/lib/og";

// Same card as the Open Graph image, for Twitter / X.
export const alt = "Manoj Rawat — AI Product Designer";
export const size = ogSize;
export const contentType = ogType;

export default function Image() {
  return homeImage();
}
