import { Session } from "next-auth"
import Image from "next/image"
import Logo from "@/image/logo.png"

interface NavbarProps {
  session: Session
}
const Navbar = ({ session }: NavbarProps) => {
  return (
    <div className="hidden md:flex justify-between items-center p-2 bg-[#20232B] text-[#C1C2C8]">
      <div>
        <Image src={Logo} alt="Logo image" width={45} height={45} />
      </div>
      <div className="flex space-x-2 justify-end items-center">
        <div>
          <p className="text-sm font-light text-white">{session.user.name}</p>
          <p className="text-xs font-light hidden sm:flex">
            {session.user.email}
          </p>
        </div>
        <Image
          width={40}
          height={40}
          referrerPolicy="no-referrer"
          className="rounded-lg"
          alt="Profile picture"
          src={session?.user.image || ""}
        />
      </div>
    </div>
  )
}

export default Navbar
