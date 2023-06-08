import {
  AlertOctagon,
  MailWarning,
  Mailbox,
  MessagesSquare,
  UserPlus,
} from "lucide-react"
import { MessageCircle } from "lucide-react"

const SideBar = () => {
  return (
    <div className="flex flex-col justify-between items-center w-56 min-h-full bg-zinc-950">
      <ul className="pt-6 h-screen space-y-4 text-xl w-44">
        <li className="flex flex-1 justify-center items-center gap-x-2 py-3 px-5 text-gray-500 hover:bg-indigo-900 rounded-lg">
          <MessageCircle />
          Chat
        </li>
        <li className="flex flex-1 justify-center items-center gap-x-2 p-2 text-gray-500 hover:bg-indigo-900 rounded-lg">
          <MessagesSquare />
          All
        </li>
        <li className="flex flex-1 justify-center items-center gap-x-2 p-2 text-gray-500 hover:bg-indigo-900 rounded-lg">
          <MailWarning />
          Unread
        </li>
        <li className="flex flex-1 justify-center items-center gap-x-2 p-2 text-gray-500 hover:bg-indigo-900 rounded-lg">
          <Mailbox />
          Chat
        </li>
        <li className="flex flex-1 justify-center items-center gap-x-2 p-2 text-gray-500 hover:bg-indigo-900 rounded-lg">
          <UserPlus />
          Add
        </li>
      </ul>
    </div>
  )
}

export default SideBar
