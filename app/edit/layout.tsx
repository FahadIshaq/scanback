import { noIndexMetadata } from "@/lib/seo"

export const metadata = noIndexMetadata

export default function EditLayout({ children }: { children: React.ReactNode }) {
  return children
}
