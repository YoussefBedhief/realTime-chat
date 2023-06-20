"use client"
import { pusherClient } from "@/lib/pusher"
import { cn, toPusherKey } from "@/lib/utils"
import { format } from "date-fns"
import { Session } from "next-auth"
import Image from "next/image"
import React, { useEffect, useRef, useState } from "react"

interface MessageProps {
  chatId: string
  initialMessages: Message[]
  session: Session
  chatPartner: User
}

const Messages = ({
  initialMessages,
  session,
  chatPartner,
  chatId,
}: MessageProps) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null)
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`))

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev])
    }

    pusherClient.bind("incoming_message", messageHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
      pusherClient.unbind("incoming_message", messageHandler)
    }
  }, [chatId])

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, "HH:mm")
  }

  return (
    <div className="flex flex-1 h-full flex-col-reverse gap-3 p-3 overflow-y-auto scrollbar-thumb-zinc-500 scrollbar-thin scrollbar-thumb-rounded-full">
      <div ref={scrollDownRef} />

      {messages.map((message, i) => {
        const isCurrentUser = message.senderId === session.user.id
        const hasNextMessageFromSameUser =
          messages[i - 1]?.senderId === messages[i].senderId
        return (
          <div className="" key={`${message.id}-${message.timestamp}`}>
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                {!hasNextMessageFromSameUser ? (
                  <p className="text-gray-400 text-xs">
                    {formatTimestamp(message.timestamp)}
                  </p>
                ) : null}
                <span
                  className={cn(
                    "px-4 py-2 inline-block rounded-lg text-white text-xs md:text-sm xl:text-base",
                    {
                      "bg-[#B785F5] rounded-br-none": isCurrentUser,
                      "bg-[#16171B] rounded-tl-none": !isCurrentUser,
                    }
                  )}
                >
                  {message.text}
                </span>
              </div>
              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  className="rounded-lg"
                  fill
                  referrerPolicy="no-referrer"
                  alt={`${message.senderId} profile image`}
                  src={
                    isCurrentUser
                      ? (session.user.image as string)
                      : chatPartner.image
                  }
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Messages
