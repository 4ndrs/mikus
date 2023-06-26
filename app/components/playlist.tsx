import Image from "next/image";

type Props = { title: string };

const Playlist = ({ title }: Props) => (
  <div className="max-h-[28.75rem] overflow-hidden rounded-xl border border-gray-700">
    <div className="bg-gray-800 pb-1 pl-4 pr-[0.38rem] pt-3">
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="my-1 text-xs text-gray-400">1 / 2</p>
    </div>

    <div className="bg-gray-900">
      <div className="flex pb-1 pr-2 pt-2">
        <span className="w-6 self-center text-center text-xs">1</span>
        <div className="relative">
          <Image
            src="/mikus.thumbnail.png"
            width="128"
            height="128"
            alt="mikus thumbnail"
          />
          <span className="absolute bottom-0 right-0 m-1 rounded bg-black px-1 py-[0.19rem] text-xs font-medium">
            00:45
          </span>
        </div>
        <h2 className="px-2 text-sm font-medium">mikus.webm</h2>
      </div>
    </div>
  </div>
);

export default Playlist;
