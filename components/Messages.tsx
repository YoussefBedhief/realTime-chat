"use client"
import { cn } from "@/lib/utils"
import { Session } from "next-auth"
import React, { useRef, useState } from "react"

interface MessageProps {
  initialMessages: Message[]
  session: Session
}

const Messages = ({ initialMessages, session }: MessageProps) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null)
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  return (
    <div className="flex flex-1 h-full flex-col-reverse gap-4 p-3 overflow-y-auto">
      <div ref={scrollDownRef} />

      {messages.map((message, i) => {
        const isCurrentUser = message.senderId === session.user.id
        const hasNextMessageFromSameUser =
          messages[i - 1]?.senderId === messages[i].senderId
        return (
          <div className="" key={`${message.id}-${message.timestamp}`}>
            <div
              className={cn("flex items-center", {
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
                {message.timestamp}
                <span
                  className={cn(
                    "px-4 py-2 inline-block rounded-lg text-white",
                    {
                      "bg-[#B785F5] rounded-br-none": isCurrentUser,
                      "bg-[#16171B] rounded-tl-none": !isCurrentUser,
                    }
                  )}
                >
                  {message.text}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Messages
