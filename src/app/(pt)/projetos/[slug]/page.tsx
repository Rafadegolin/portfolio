import { CaseStudyPage, caseStudyMetadata, caseStudyParams } from "@/components/CaseStudyPage";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = caseStudyParams;

export async function generateMetadata({ params }: Props) {
  return caseStudyMetadata("pt", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <CaseStudyPage locale="pt" slug={(await params).slug} />;
}
