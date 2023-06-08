import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import React from "react"

const DashboardPage = async () => {
  const session = await getServerSession(authOptions)
  return <pre>dashboard</pre>
}

export default DashboardPage
