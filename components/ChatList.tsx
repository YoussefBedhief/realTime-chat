"use client"
import { ChatUrlSort } from "@/lib/utils"
import { Session } from "next-auth"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ChatListProps {
  friends: User[]
  session: Session
}

const ChatList = ({ friends, session }: ChatListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  }, [pathname])

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id
        }).length
        return (
          <li key={friend.id} className="hover:bg-[#1A1E23] rounded-lg group">
            <a
              href={`/dashboard/chat/${ChatUrlSort(
                friend.id,
                session.user.id
              )}`}
              className=" text-white font-semibold flex justify-start items-center space-x-2 p-2"
            >
              <div className="flex items-end">
                <Image
                  alt="profile image"
                  src={friend.image}
                  referrerPolicy="no-referrer"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                {unseenMessagesCount > 0 ? (
                  <div className="bg-indigo-600 font-extralight text-xs text-white w-4 h-4 rounded-full flex items-center justify-center p-2 relative right-2">
                    {unseenMessagesCount}
                  </div>
                ) : null}
              </div>
              <div className=" truncate">
                <p className="text-sm group-hover:text-[#5852D6] ">
                  {friend.name}
                </p>
                <p className="text-xs font-light text-[#C1C2C8]">
                  {friend.email}
                </p>
              </div>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default ChatList
