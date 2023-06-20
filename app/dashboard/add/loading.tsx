import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const loading = () => {
  return (
    <div className="w-full flex flex-col gap-3">
      <Skeleton
        className="mb-4"
        height={60}
        width={500}
        baseColor="#182736"
        highlightColor="#263342"
      />
      <Skeleton
        height={20}
        width={150}
        baseColor="#182736"
        highlightColor="#263342"
      />
      <Skeleton
        height={50}
        width={400}
        baseColor="#182736"
        highlightColor="#263342"
      />
    </div>
  )
}

export default loading
