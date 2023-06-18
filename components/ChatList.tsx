"use client"
import { pusherClient } from "@/lib/pusher"
import { ChatUrlSort, toPusherKey } from "@/lib/utils"
import { Session } from "next-auth"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import UnseenChatToast from "./UnseenChatToast"

interface ChatListProps {
  friends: User[]
  session: Session
}

interface ExtendedMessage extends Message {
  senderImg: string
  senderName: string
}

const ChatList = ({ friends, session }: ChatListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  const [friendList, setFriendList] = useState<User[]>(friends)

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${session.user.id}:chats`))
    pusherClient.subscribe(toPusherKey(`user:${session.user.id}:friends`))

    const newFriendHandler = (newFriend: User) => {
      console.log("received new user", newFriend)
      setFriendList((prev) => [...prev, newFriend])
    }

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${ChatUrlSort(session.user.id, message.senderId)}`

      if (!shouldNotify) return

      // should be notified
      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={session.user.id}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ))

      setUnseenMessages((prev) => [...prev, message])
    }

    pusherClient.bind("new_message", chatHandler)
    pusherClient.bind("new_friend", newFriendHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${session.user.id}:chats`))
      pusherClient.unsubscribe(toPusherKey(`user:${session.user.id}:friends`))

      pusherClient.unbind("new_message", chatHandler)
      pusherClient.unbind("new_friend", newFriendHandler)
    }
  }, [pathname, session.user.id, router])

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  }, [pathname])

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friendList.sort().map((friend) => {
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
