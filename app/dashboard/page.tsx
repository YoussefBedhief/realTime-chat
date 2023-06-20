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

const DashboardPage = async () => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)
  const friendNumber = friends.length

  const AllfriendsMessages = await Promise.all(
    friends.map(async (friend) => {
      const allMessage = (await fetchRedis(
        "zrange",
        `chat:${ChatUrlSort(session.user.id, friend.id)}:messages`,
        0,
        -1
      )) as string[]

      const messages = allMessage.map(
        (message) => JSON.parse(message) as Message
      )

      return {
        ...friend,
        messageNumber: messages.length,
      }
    })
  )
  return <div></div>
}

export default DashboardPage
