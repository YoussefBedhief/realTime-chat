import { BanIcon, PhoneCallIcon, VideoIcon, VolumeXIcon } from "lucide-react"
import Image from "next/image"

interface InfoPanelProps {
  chatPartner: User
}

const InfoPanel = ({ chatPartner }: InfoPanelProps) => {
  return (
    <div className="w-[400px] xl:flex flex-col gap-y-2 hidden ">
      <div className="bg-[#5852D6] flex flex-col p-4 m-2 rounded-xl space-y-4">
        <div className="flex space-x-3 items-center">
          <div className="relative w-8 h-8">
            <Image
              fill
              src={chatPartner.image}
              alt={`${chatPartner.name} profile image`}
              className="rounded-lg"
            />
          </div>
          <div>
            <p className="text-sm"> {chatPartner.name} </p>
            <p className="text-xs font-light truncate"> {chatPartner.email} </p>
          </div>
        </div>
        <div className="flex items-center justify-evenly">
          <PhoneCallIcon className="p-2 hover:bg-[#6A64DC] w-9 h-9 rounded-xl  " />
          <VideoIcon className="p-2 hover:bg-[#6A64DC] w-9 h-9 rounded-xl  " />
          <VolumeXIcon className="p-2 hover:bg-[#6A64DC] w-9 h-9 rounded-xl  " />
          <BanIcon className="p-2 hover:bg-[#6A64DC] w-9 h-9 rounded-xl  " />
        </div>
        <p className="text-sm font-light">
          Say hello to {chatPartner.name} 👋{" "}
        </p>
      </div>
      <div className="m-2 space-y-4 text-[#72757D] ">
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span> Attachements</span>
            <span className="transition group-open:rotate-180">
              <svg
                fill="none"
                height="24"
                shape-rendering="geometricPrecision"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </span>
          </summary>
        </details>
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span> Links</span>
            <span className="transition group-open:rotate-180">
              <svg
                fill="none"
                height="24"
                shape-rendering="geometricPrecision"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </span>
          </summary>
        </details>
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span> Images</span>
            <span className="transition group-open:rotate-180">
              <svg
                fill="none"
                height="24"
                shape-rendering="geometricPrecision"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </span>
          </summary>
        </details>
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span> Vocal and videos</span>
            <span className="transition group-open:rotate-180">
              <svg
                fill="none"
                height="24"
                shape-rendering="geometricPrecision"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </span>
          </summary>
        </details>
      </div>
      <div></div>
    </div>
  )
}

export default InfoPanel
