import { PayloadRedirects } from "@/components/PayloadRedirects"
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback='Redirecting ...'>
      <PayloadRedirects url='/' />
    </Suspense>
  )
}
