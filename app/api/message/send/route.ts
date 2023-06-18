import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { Message, messageSchema } from "@/lib/validations/message"
import { nanoid } from "nanoid"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    // Get the body of the request
    const { text, chatId }: { text: string; chatId: string } = await req.json()
    // Get the session information
    const session = await getServerSession(authOptions)
    // If the user is not authenticated then return an 401 error
    if (!session) return new Response("Unauthorized", { status: 401 })
    // Split the two id of the two chat members
    const [userId1, userId2] = chatId.split("--")
    //If the user who is authenticated is not one of the two members then return an 401 error
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 })
    }
    // Get the other member id of the chat
    const friendId = session.user.id === userId1 ? userId2 : userId1
    // Get the friend list of the authenticated user
    const friendList = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    )) as string[]
    // Check if the friend is in the friend list
    const isFriend = friendList.includes(friendId)
    // If the user is not in the friend list then return an 401 error
    if (!isFriend) {
      return new Response("Unauthorized", { status: 401 })
    }
    // Get the friend list data
    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string
    const sender = JSON.parse(rawSender) as User
    // Store in the timestamp the moment which the message was sent
    const timestamp = Date.now()
    // Get the message data
    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    }
    // Validate the message data
    const message = messageSchema.parse(messageData)

    //Notify all the chat room member
    pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "incoming_message",
      message
    )
    await pusherServer.trigger(
      toPusherKey(`user:${friendId}:chats`),
      "new_message",
      {
        ...message,
        senderImg: sender.image,
        senderName: sender.name,
      }
    )
    // If everything is valid then store the message in the database
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    })
    // finally return a success message
    return new Response("Message sent successfully ")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 })
    }
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }

    return new Response("Internal Server Error", { status: 500 })
  }
}
