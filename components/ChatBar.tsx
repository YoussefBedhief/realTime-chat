import { getFriendsByUserId } from "@/helpers/friend-by-id"
import { Session } from "next-auth"

interface ChatBarProps {
  session: Session
}

const ChatBar = async ({ session }: ChatBarProps) => {
  const friends = await getFriendsByUserId(session.user.id)

  return (
    <div>
      {friends.length > 0 ? (
        <div className="hidden md:flex md:w-64 bg-[#20232B] text-[#C1C2C8] h-[91vh]  md:flex-col md:items-center p-2">
          Chat and messages
        </div>
      ) : null}
    </div>
  )
}

export default ChatBar
