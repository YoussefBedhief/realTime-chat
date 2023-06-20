"use client"
import { pusherClient } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import {
  Github,
  LayoutDashboardIcon,
  LogOut,
  Mailbox,
  MessagesSquare,
  UserPlus,
} from "lucide-react"
import { MessageCircle } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

interface SideBarProps {
  unseenRequestCount: number
  sessionId: string
}

const SideBar = ({ unseenRequestCount, sessionId }: SideBarProps) => {
  const router = useRouter()
  const [requestCount, setRequestCount] = useState<number>(unseenRequestCount)

  useEffect(() => {
    try {
    } catch (error) {}
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )

    const friendRequestHandler = () => {
      setRequestCount((prev) => prev + 1)
    }

    pusherClient.bind("incoming_friend_requests", friendRequestHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler)
    }
  }, [sessionId])
  return (
    <div className="flex flex-col justify-between min-h-[92vh] items-center xl:w-56 bg-zinc-950">
      <ul className="pt-6 space-y-4 text-xl w-16 xl:w-44">
        <li className=" text-gray-500 hover:bg-indigo-900 rounded-lg hover:text-white">
          <Link
            rel="preload"
            className="flex flex-1 justify-between items-center gap-x-2 p-2"
            href={""}
            as={""}
          >
            <div className="flex justify-center items-center space-x-2">
              <LayoutDashboardIcon />
              <p className="hidden xl:flex">Dashboard</p>
            </div>
          </Link>
        </li>
        <li className=" text-gray-500 hover:bg-indigo-900 rounded-lg hover:text-white">
          <Link
            rel="preload"
            className="flex flex-1 justify-between items-center gap-x-2 p-2"
            href={"/dashboard/allChat"}
            as={"/dashboard/allChat"}
          >
            <div className="flex justify-center items-center space-x-2">
              <MessagesSquare />
              <p className="hidden xl:flex"> All</p>
            </div>
          </Link>
        </li>
        <li className=" text-gray-500 hover:bg-indigo-900 rounded-lg hover:text-white">
          <Link
            rel="preload"
            className="flex flex-1 justify-start xl:justify-between items-start xl:items-center xl:gap-x-2 p-2"
            onClick={() => setRequestCount(0)}
            href={"/dashboard/request"}
            as={"/dashboard/request"}
          >
            <div className="flex justify-center items-center space-x-2">
              <Mailbox />
              <p className="hidden xl:flex">Requests</p>
            </div>
            {requestCount > 0 ? (
              <div className="text-white rounded-full bg-indigo-600 w-3 h-3 xl:w-5 xl:h-5 text-[8px] xl:text-xs flex items-center justify-center">
                {requestCount}
              </div>
            ) : null}
          </Link>
        </li>
        <li className=" text-gray-500 hover:bg-indigo-900 rounded-lg hover:text-white">
          <Link
            rel="preload"
            className="flex flex-1 justify-between items-center gap-x-2 p-2"
            href={"/dashboard/add"}
            as={"/dashboard/add"}
          >
            <div className="flex justify-center items-center space-x-2">
              <UserPlus />
              <p className="hidden xl:flex"> Add</p>
            </div>
          </Link>
        </li>
        <li className=" flex justify-between items-center text-gray-500 hover:bg-indigo-900 rounded-lg hover:text-white">
          <button
            className="flex items-center gap-x-2 p-2"
            onClick={async () => {
              try {
                await signOut({ redirect: true, callbackUrl: "/login" })
                router.push("/login")
              } catch (error) {
                toast.error("There was a problem signing out")
              }
            }}
          >
            <LogOut />
            <p className="hidden xl:flex"> Log Out</p>
          </button>
        </li>
      </ul>
      <div className="hidden xl:flex bg-[#B785F5] flex-col w-[75%] rounded-lg p-4 mb-10 space-y-10">
        <div className="text-center">
          <p className="text-center">Want to see the code source</p>
          <small className="text-center">check the repo linked bellow</small>
        </div>
        <Link
          href={"https://github.com/YoussefBedhief/realTime-chat"}
          target="_blank"
          className="text-white flex justify-center items-center bg-black rounded-lg p-2"
        >
          <Github />
          <p>github</p>
        </Link>
      </div>
    </div>
  )
}

export default SideBar
