import { Button } from "@/components/ui/button"
import { Suspense } from "react"

export default function Home() {
  return (
    <div>
      <Suspense fallback={'loading...'}>
        <Button>Click me</Button>
      </Suspense>
      <h1 className='underline'>heading</h1>
    </div>
  )
}
