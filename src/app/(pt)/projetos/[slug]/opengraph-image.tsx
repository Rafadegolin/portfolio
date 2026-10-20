import { caseStudyParams } from "@/components/CaseStudyPage";
import { ogSize, renderProjectOgImage } from "@/components/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Case study";
export const generateStaticParams = caseStudyParams;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return renderProjectOgImage("pt", (await params).slug);
}
