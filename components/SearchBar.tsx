"use client"
import { SearchIcon } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"

interface SearchBarProps {
  friendList: User[]
  setFriendList: Dispatch<SetStateAction<User[]>>
}
const SearchBar = ({ friendList, setFriendList }: SearchBarProps) => {
  const [value, setValue] = useState<string>("")
  return (
    <div className="flex items-center justify-start rounded-xl bg-[#16171B] p-2 w-full m-2 focus-within:ring-inset focus-within:ring-1 ring-indigo-600">
      <SearchIcon className="w-5 h-5 text-gray-500" />
      <input
        type="text"
        placeholder="Search for friend"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        className="bg-transparent p-2 border-none w-[75%] ring-0 outline-none focus:ring-0"
      />
    </div>
  )
}

export default SearchBar
