import { getContent, t } from "@/content";
import { ogSize, renderOgImage } from "@/components/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = t(getContent().seo.title, "en");

export default function Image() {
  return renderOgImage("en");
}
