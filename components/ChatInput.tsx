"use client"
import { useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"

interface ChatInputProps {
  chatPartner: User
}

const ChatInput = ({ chatPartner }: ChatInputProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [input, setInput] = useState<string>("")

  const sendMessage = () => {}
  return (
    <div className=" text-white flex w-full my-4">
      <div className="bg-[#16171B] rounded-xl flex-1 p-2 mx-4 focus-within:ring-inset focus-within:ring-1 ring-indigo-600 ">
        <TextareaAutosize
          ref={textAreaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Say hi 👋 to ${chatPartner.name}`}
          className="w-full resize-none border-0 bg-transparent text-white placeholder:text-gray-600 ring-0 outline-none focus:ring-0 "
        />
        <div
          onClick={() => textAreaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        ></div>
        <div></div>
      </div>
    </div>
  )
}

export default ChatInput
