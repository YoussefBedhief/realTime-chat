import { UserPlus, X, XOctagon } from "lucide-react"
import Image from "next/image"

interface FriendRequestProps {
  data: FriendRequest[]
}

const FriendRequest = ({ data }: FriendRequestProps) => {
  return (
    <div className="w-full flex flex-col justify-start items-center md:items-start space-y-10">
      {data.length == 0 ? (
        <p className="flex items-center justify-center text-4xl text-center">
          <XOctagon />
          No friend request received today
        </p>
      ) : (
        data.map((request) => (
          <div className="w-[75%] flex border justify-between items-center p-4 bg-[#1A1E23] border-zinc-800 shadow rounded-lg">
            <div className="flex items-center">
              <Image
                alt="Profile Image"
                src={request.friendImageUrl}
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
              <button className="border border-black rounded-full md:rounded-lg p-2 flex items-center justify-center gap-x-2 hover:bg-green-600 hover:border-green-600">
                <UserPlus className="w-5 h-5" />
                <p className="hidden md:flex">ADD</p>
              </button>
              <button className="border border-black rounded-full md:rounded-lg p-2 flex items-center justify-center gap-x-2 hover:bg-red-600 hover:border-red-600">
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
