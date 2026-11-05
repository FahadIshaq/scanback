import { noIndexMetadata } from "@/lib/seo"

export const metadata = noIndexMetadata

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return children
}
