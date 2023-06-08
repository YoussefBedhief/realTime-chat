import Navbar from "@/components/Navbar"
import SideBar from "@/components/SideBar"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

const DashbordLayout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  return (
    <div>
      <Navbar session={session} />
      <div className="flex space-x-2">
        <SideBar />
        {children}
      </div>
    </div>
  )
}

export default DashbordLayout
