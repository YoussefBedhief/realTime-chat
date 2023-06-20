import { getFriendsByUserId } from "@/helpers/friend-by-id"
import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { ChatUrlSort } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import React from "react"

const AllChatPage = async () => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${ChatUrlSort(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[]

      const lastMessage = JSON.parse(lastMessageRaw) as Message

      return {
        ...friend,
        lastMessage,
      }
    })
  )

  return (
    <div className="flex w-full flex-col mx-4 py-12 space-y-2">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className="text-sm text-white">Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className="relative bg-[#1A1E23] border-zinc-800 border p-3 rounded-md"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400" />
            </div>

            <Link
              href={`/dashboard/chat/${ChatUrlSort(
                session.user.id,
                friend.id
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6">
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-lg"
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1 max-w-md">
                  <span className="text-zinc-400">
                    {friend.lastMessage.senderId === session.user.id
                      ? "You: "
                      : ""}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}

export default AllChatPage
