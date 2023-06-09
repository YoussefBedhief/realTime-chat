import FriendRequest from "@/components/FriendRequest"
import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { Metadata } from "next"
import { getServerSession } from "next-auth"

export const metadata: Metadata = {
  title: "Friend Circle | Inbox",
}
const RequestFriendPage = async () => {
  const session = await getServerSession(authOptions)

  //Get the id of the friend request sender
  const senderIds = (await fetchRedis(
    "smembers",
    `user:${session?.user.id}:incoming_friend_requests`
  )) as string[]

  const friendRequest = await Promise.all(
    senderIds.map(async (id) => {
      const request = (await fetchRedis("get", `user:${id}`)) as string
      const friend = JSON.parse(request) as User
      return {
        friendId: id,
        friendEmail: friend.email,
        friendName: friend.name,
        friendImageUrl: friend.image,
      }
    })
  )

  return (
    <main className="flex flex-col items-center flex-1 p-2 space-y-10">
      <h1 className="text-3xl md:text-5xl font-bold">Friend Request</h1>
      <FriendRequest sessionId={session?.user.id!} data={friendRequest} />
    </main>
  )
}

export default RequestFriendPage
