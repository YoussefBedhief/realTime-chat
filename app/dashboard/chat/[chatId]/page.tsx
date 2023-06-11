import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { messageArraySchema } from "@/lib/validations/message"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import React from "react"

interface ChatPageProps {
  params: {
    chatId: string
  }
}

async function getchatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:mesasges`,
      0,
      -1
    )
    const dbMessages = results.map((message) => JSON.parse(message) as Message)
    const reverseDbMessages = dbMessages.reverse()

    const messages = messageArraySchema.parse(reverseDbMessages)
    return messages
  } catch (error) {
    notFound()
  }
}

const ChatPage = async ({ params }: ChatPageProps) => {
  const { chatId } = params
  const session = await getServerSession(authOptions)

  if (!session) {
    notFound()
  }

  const { user } = session
  const [userId1, userId2] = chatId.split("--")

  if (user.id !== userId1 && user.id !== userId2) {
    notFound()
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1

  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User

  const initialMessages = await getchatMessages(chatId)

  return <div>{chatId}</div>
}

export default ChatPage
