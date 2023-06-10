import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { id: idToAccept } = z.object({ id: z.string() }).parse(body)
    console.log("body content", body)
    const session = await getServerSession(authOptions)

    // If the user is not authenticated then return an error
    if (!session) {
      return new Response("Unauthorized user", { status: 401 })
    }

    // If the both users are already friends then return an error
    const isAlreadyFriend = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAccept
    )

    if (isAlreadyFriend) {
      return new Response("Both user are already friends", { status: 400 })
    }

    // If the user have sent a friend request
    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAccept
    )

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 })
    }
    //Adding both friend to each other
    await db.sadd(`user:${session.user.id}:friends`, idToAccept)
    await db.sadd(`user:${idToAccept}:friends`, session.user.id)
    //removing the request from the database in both sides
    await db.srem(
      `user:${session.user.id}:incoming_friend_requests`,
      idToAccept
    )
    await db.srem(
      `user:${idToAccept}:incoming_friend_requests`,
      session.user.id
    )

    return new Response("Friend Added successfully")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 })
    }

    return new Response("Invalid request", { status: 400 })
  }
}
