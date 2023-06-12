import ChatBar from "@/components/ChatBar"
import Navbar from "@/components/Navbar"
import SideBar from "@/components/SideBar"
import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

const DashbordLayout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length
  return (
    <div className="bg-zinc-950 text-white">
      <Navbar session={session} />
      <div className="flex">
        <SideBar
          unseenRequestCount={unseenRequestCount}
          sessionId={session.user.id}
        />
        <ChatBar session={session} />
        {children}
      </div>
    </div>
  )
}

export default DashbordLayout
