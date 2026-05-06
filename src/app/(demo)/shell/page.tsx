import { redirect } from "next/navigation"

/** Default prototype entry — Search–Ask–Build. Promotional Banner lives at `/shell/promotional`. */
export default function ShellIndexPage() {
  redirect("/shell/search-ask-build")
}
