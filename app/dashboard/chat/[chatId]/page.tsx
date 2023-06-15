import ChatInput from "@/components/ChatInput"
import InfoPanel from "@/components/InfoPanel"
import Messages from "@/components/Messages"
import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { messageArraySchema } from "@/lib/validations/message"
import { Palette, Trash2 } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
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
      `chat:${chatId}:messages`,
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

  return (
    <div className=" bg-[#20232B] flex flex-1 min-h-[92vh] max-h-[calc(100vh-6rem)] justify-between ">
      <div className=" flex flex-col w-full justify-between h-full">
        <div className="bg-black flex p-2 items-center justify-between rounded-t-3xl ">
          <div className="flex items-center space-x-4 flex-1">
            <Image
              src={chatPartner.image}
              alt={`${chatPartner.name} profile image`}
              width={50}
              height={50}
              className="rounded-lg"
            />
            <p className="">
              <span className="font-light text-[#7A7A7A] ">
                Conversation with
              </span>{" "}
              <span className="font-semibold">{chatPartner.name}</span>
            </p>
          </div>
          <div className="flex items-center justify-evenly space-x-3 mr-2">
            <button className="p-4 bg-[#262626] rounded-xl ">
              Send an E-mail
            </button>
            <Palette className="h-5 w-5 cursor-pointer" />
            <Trash2 className="h-5 w-5 cursor-pointer" />
          </div>
        </div>
        <div className="flex-1 flex-col flex bg-[#1D1E24] ">
          <Messages
            chatPartner={chatPartner}
            initialMessages={initialMessages}
            session={session}
          />
          <ChatInput chatId={chatId} chatPartner={chatPartner} />
        </div>
      </div>
      <InfoPanel />
    </div>
  )
}

export default ChatPage
