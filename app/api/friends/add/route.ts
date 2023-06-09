import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { addFriendValidator } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    // Get the content ot the request body
    const body = await req.json()
    // Get the email address sent
    const { email: emailToAdd } = addFriendValidator.parse(body.email)

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string
    // Check if the user exists in the redis database
    if (!idToAdd) {
      return new Response("This person does not exist.", { status: 400 })
    }

    const session = await getServerSession(authOptions)
    // Check if the user is authenticated
    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    //Check if the user is not adding themselves
    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      })
    }

    // Check if the user is already added
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1

    if (isAlreadyAdded) {
      return new Response("Already added this user", { status: 400 })
    }

    // Check if the user is already added
    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1

    if (isAlreadyFriends) {
      return new Response("Already friends with this user", { status: 400 })
    }

    // valid request, send friend request
    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {
        friendId: session.user.id,
        friendName: session.user.name,
        friendEmail: session.user.email,
        friendImageUrl: session.user.image,
      }
    )

    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 })
    }

    return new Response("Invalid request", { status: 400 })
  }
}
