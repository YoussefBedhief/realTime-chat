"use client"
import { Github, LogOut, Mailbox, MessagesSquare, UserPlus } from "lucide-react"
import { MessageCircle } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"

interface SideBarProps {
  unseenRequestCount: number
  sessionId: string
}

const SideBar = ({ unseenRequestCount, sessionId }: SideBarProps) => {
  const router = useRouter()
  const [requestCount, setRequestCount] = useState<number>(unseenRequestCount)
  return (
    <div className="flex flex-col justify-between min-h-[92vh] items-center md:w-56 bg-zinc-950">
      <ul className="pt-6 space-y-4 text-xl w-16 md:w-44">
        <li className=" text-gray-500 hover:bg-indigo-900 rounded-lg hover:text-white">
          <Link
            className="flex flex-1 justify-between items-center gap-x-2 p-2"
            href={""}
          >
            <div className="flex justify-center items-center space-x-2">
              <MessageCircle />
              <p className="hidden md:flex">Chat</p>
            </div>
          </Link>
        </li>
        <li className=" text-gray-500 hover:bg-indigo-900 rounded-lg hover:text-white">
          <Link
            className="flex flex-1 justify-between items-center gap-x-2 p-2"
            href={""}
          >
            <div className="flex justify-center items-center space-x-2">
              <MessagesSquare />
              <p className="hidden md:flex"> All</p>
            </div>
          </Link>
        </li>
        <li className=" text-gray-500 hover:bg-indigo-900 rounded-lg hover:text-white">
          <Link
            className="flex flex-1 justify-center md:justify-between items-start md:items-center md:gap-x-2 p-2"
            href={"/dashboard/request"}
          >
            <div className="flex justify-center items-center space-x-2">
              <Mailbox />
              <p className="hidden md:flex">Requests</p>
            </div>
            {requestCount > 0 ? (
              <div className="text-white rounded-full bg-indigo-600 w-3 h-3 md:w-5 md:h-5 text-[8px] md:text-xs flex items-center justify-center">
                {requestCount}
              </div>
            ) : null}
          </Link>
        </li>
        <li className=" text-gray-500 hover:bg-indigo-900 rounded-lg hover:text-white">
          <Link
            className="flex flex-1 justify-between items-center gap-x-2 p-2"
            href={"/dashboard/add"}
          >
            <div className="flex justify-center items-center space-x-2">
              <UserPlus />
              <p className="hidden md:flex"> Add</p>
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
            <p className="hidden md:flex"> Log Out</p>
          </button>
        </li>
      </ul>
      <div className="hidden md:flex bg-indigo-900 flex-col w-[75%] rounded-lg p-4 mb-10 space-y-10">
        <div className="text-center">
          <p className="text-center">Want to see the code source</p>
          <small className="text-center">check the repo linked bellow</small>
        </div>
        <Link
          href={"https://github.com/YoussefBedhief/realTime-chat"}
          target="_blank"
          className="text-white flex justify-center items-center bg-black rounded-lg p-4"
        >
          <Github />
          <p>github</p>
        </Link>
      </div>
    </div>
  )
}

export default SideBar
