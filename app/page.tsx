import Button from "@/components/ui/Button"
import { db } from "@/lib/db"

export default async function Home() {
  return (
    <div className="">
      Real time chat app
      <Button>Click me</Button>
    </div>
  )
}
