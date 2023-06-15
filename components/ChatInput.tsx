"use client"
import { SendIcon } from "lucide-react"
import { useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import Button from "./ui/Button"
import axios from "axios"
import { toast } from "react-hot-toast"

interface ChatInputProps {
  chatPartner: User
  chatId: string
}

const ChatInput = ({ chatPartner, chatId }: ChatInputProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [input, setInput] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const sendMessage = async () => {
    if (!input) return
    setLoading(true)

    try {
      console.log("first")
      await axios.post("/api/message/send", { text: input, chatId })
      console.log("second")

      setInput("")
      console.log("third")
      textAreaRef.current?.focus()
      console.log("Sent")
    } catch {
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className=" text-white flex w-full my-4 items-center">
      <div className="bg-[#16171B] rounded-xl flex items-center justify-between flex-1 p-2 mx-4 focus-within:ring-inset focus-within:ring-1 ring-indigo-600 ">
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
        <div className="group hover:bg-indigo-800 rounded-lg flex items-end justify-center">
          <Button
            isLoading={loading}
            variant={"normal"}
            size={"sm"}
            type="submit"
            onClick={() => {
              sendMessage()
            }}
          >
            {loading ? null : (
              <SendIcon className="text-indigo-800 group-hover:text-white mt-1" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
