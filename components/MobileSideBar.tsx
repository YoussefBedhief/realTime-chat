"use client"

import { Transition, Dialog } from "@headlessui/react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FC, Fragment, useEffect, useState } from "react"

import { Session } from "next-auth"
import { usePathname } from "next/navigation"
import Button from "./ui/Button"
import ChatList from "./ChatList"

interface MobileSideBarProps {
  session: Session
  friends: User[]
}

const MobileSideBar = ({ session, friends }: MobileSideBarProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="fixed md:hidden bg-[#20232B] border-b text-[#C1C2C8] border-zinc-800 top-0 inset-x-0 px-4">
      <div className="flex justify-between items-center p-2 w-full">
        <Link href="/dashboard">Logo </Link>
        <Button onClick={() => setOpen(true)} className="gap-4">
          Chat <Menu className="h-6 w-6" />
        </Button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-hidden bg-[#20232B] py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-300">
                            Dashboard
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-[#20232B] text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {/* Content */}
                        <div className="flex space-x-2 justify-start items-center">
                          <Image
                            width={40}
                            height={40}
                            referrerPolicy="no-referrer"
                            className="rounded-lg"
                            alt="Profile picture"
                            src={session?.user.image || ""}
                          />
                          <div>
                            <p className="text-sm font-light text-white">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-gray-300 font-light hidden sm:flex">
                              {session.user.email}
                            </p>
                          </div>
                        </div>
                        <ChatList session={session} friends={friends} />
                        {/* content end */}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default MobileSideBar
