import { getFriendsByUserId } from "@/helpers/friend-by-id"
import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { ChatUrlSort } from "@/lib/utils"
import {
  Card,
  Text,
  Metric,
  DonutChart,
  Title,
  BarChart,
  Legend,
} from "@tremor/react"
import { MailMinus, MailPlus, Mails, Users } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { notFound } from "next/navigation"

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
  const mostTextedFriend = AllfriendsMessages.reduce(function (prev, current) {
    return prev.messageNumber > current.messageNumber ? prev : current
  })
  const leastTextedFriend = AllfriendsMessages.reduce(function (prev, current) {
    return prev.messageNumber < current.messageNumber ? prev : current
  })
  const allMessages = AllfriendsMessages.map((message) => {
    return {
      email: message.email,
      number: message.messageNumber,
      "Total messages texted": message.messageNumber,
    }
  })
  const legendData = AllfriendsMessages.map((message) => {
    return message.name
  })
  return (
    <div className="flex flex-col p-4 w-full gap-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card decoration="top" decorationColor="blue" className="gap-y-5">
          <div className="space-y-2">
            <div className="flex flex-row space-x-3 items-center justify-start">
              <Users />
              <Text>Friend number</Text>
            </div>
            <Metric>{friendNumber}</Metric>
          </div>
        </Card>
        <Card decoration="top" decorationColor="indigo" className="gap-y-5">
          <div className="space-y-2">
            <div className="flex flex-row space-x-3 items-center justify-start">
              <MailPlus />
              <Text>The most texted friend</Text>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Image
                  referrerPolicy="no-referrer"
                  width={30}
                  height={30}
                  className="rounded-lg"
                  alt={`${mostTextedFriend.name} profile picture`}
                  src={mostTextedFriend.image}
                />
                <p>{mostTextedFriend.name} </p>
              </div>
              <Metric className="flex items-center justify-end gap-x-2">
                {mostTextedFriend.messageNumber}
                <Mails />
              </Metric>
            </div>
          </div>
        </Card>
        <Card decoration="top" decorationColor="red" className="gap-y-5">
          <div className="space-y-2">
            <div className="flex flex-row space-x-3 items-center justify-start">
              <MailMinus />
              <Text>The least texted friend</Text>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Image
                  referrerPolicy="no-referrer"
                  width={30}
                  height={30}
                  className="rounded-lg"
                  alt={`${leastTextedFriend.name} profile picture`}
                  src={leastTextedFriend.image}
                />
                <p>{leastTextedFriend.name} </p>
              </div>
              <Metric className="flex items-center justify-end gap-x-2">
                {leastTextedFriend.messageNumber}
                <Mails />
              </Metric>
            </div>
          </div>
        </Card>
        <Card>
          <Title> All Messages</Title>
          <DonutChart
            data={allMessages}
            variant="pie"
            category="number"
            index="email"
          />
          <Legend categories={legendData} className="mt-6" />
        </Card>
        <Card className="col-span-2">
          <Title> All Messages</Title>
          <BarChart
            data={allMessages}
            index="email"
            categories={["Total messages texted"]}
            colors={["indigo"]}
          />
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
