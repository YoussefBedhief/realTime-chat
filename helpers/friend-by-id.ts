import { fetchRedis } from "./redis"

export const getFriendsByUserId = async (userId: string) => {
  //Get all friendId of the user
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[]

  //Get all friend data of the user at the same time
  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friend = (await fetchRedis("get", `user:${friendId}`)) as string
      const parsedFriend = JSON.parse(friend) as User
      return parsedFriend
    })
  )

  return friends
}
