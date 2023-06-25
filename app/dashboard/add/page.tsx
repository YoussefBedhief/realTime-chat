import AddFriend from "@/components/AddFriend"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Friend Circle | Add",
}

const page = () => {
  return (
    <main className=" flex flex-col flex-1 items-center md:items-start p-4">
      <h1 className="font-bold text-5xl mb-8 text-center md:text-left">
        Create your circle
      </h1>
      <AddFriend />
    </main>
  )
}

export default page
