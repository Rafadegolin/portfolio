import { TldrPage, tldrMetadata } from "@/components/TldrPage";

export const metadata = tldrMetadata("en");

export default function Page() {
  return <TldrPage locale="en" />;
}
