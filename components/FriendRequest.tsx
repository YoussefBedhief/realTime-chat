"use client"

import axios from "axios"
import { UserPlus, X, XOctagon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface FriendRequestProps {
  data: {
    friendId: string
    friendEmail: string
    friendName: string
    friendImageUrl: string
  }[]
}

const FriendRequest = ({ data }: FriendRequestProps) => {
  const router = useRouter()
  const [friendReq, setFriendReq] = useState<
    {
      friendId: string
      friendEmail: string
      friendName: string
      friendImageUrl: string
    }[]
  >(data)

  const acceptFriendRequest = async (friendId: string) => {
    await axios.post("/api/friends/accept", { id: friendId })

    setFriendReq((prev) =>
      prev.filter((request) => request.friendId !== friendId)
    )
    router.refresh()
  }
  const denyFriendRequest = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId })

    setFriendReq((prev) =>
      prev.filter((request) => request.friendId !== senderId)
    )

    router.refresh()
  }

  return (
    <div className="w-full flex flex-col justify-start items-center md:items-start space-y-10">
      {data.length == 0 ? (
        <p className="flex flex-col md:flex-row items-center justify-center text-xl md:text-3xl text-center gap-x-2 w-full">
          <XOctagon className="hidden md:flex w-9 h-9" />
          No friend request received today
          <XOctagon className="md:hidden flex w-9 h-9" />
        </p>
      ) : (
        friendReq.map((request) => (
          <div
            key={request.friendId}
            className="w-[75%] flex border justify-between items-center p-4 bg-[#1A1E23] border-zinc-800 shadow rounded-lg"
          >
            <div className="flex items-center">
              <Image
                alt="Profile Image"
                src={request.friendImageUrl}
                referrerPolicy="no-referrer"
                width={50}
                height={50}
                className="w-6 sm:w-10 lg:w-12 h-6 sm:h-10 lg:h-12 rounded-lg"
              />
              <div className="flex flex-col mx-2 space-y-1">
                <p className="text-xs lg:text-base">{request.friendName}</p>
                <p className="hidden text-sm lg:flex ">{request.friendEmail}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => acceptFriendRequest(request.friendId)}
                className="border border-black rounded-full md:rounded-lg p-2 flex items-center justify-center gap-x-2 hover:bg-green-600 hover:border-green-600"
              >
                <UserPlus className="w-5 h-5" />
                <p className="hidden md:flex">ADD</p>
              </button>
              <button
                onClick={() => denyFriendRequest(request.friendId)}
                className="border border-black rounded-full md:rounded-lg p-2 flex items-center justify-center gap-x-2 hover:bg-red-600 hover:border-red-600"
              >
                <X className="w-5 h-5" />
                <p className="hidden md:flex">DENY</p>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default FriendRequest
