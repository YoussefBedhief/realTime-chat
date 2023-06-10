import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { id: idToDeny } = z.object({ id: z.string() }).parse(body)

    const session = await getServerSession(authOptions)

    // If the user is not authenticated then return an error
    if (!session) {
      return new Response("Unauthorized user", { status: 401 })
    }

    // If the user have sent a friend request
    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToDeny
    )

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 })
    }

    //removing the request from the database in both sides
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny)
    await db.srem(`user:${idToDeny}:incoming_friend_requests`, session.user.id)

    return new Response("Request denied")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 })
    }

    return new Response("Invalid request", { status: 400 })
  }
}
