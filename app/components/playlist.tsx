import Link from "next/link";
import Image from "next/image";

import type { Video } from "../types";

type Props = {
  title: string;
  videos: Video[];
  selectedId: string;
};

const Playlist = ({ title, videos, selectedId }: Props) => (
  <aside className="overflow-hidden rounded-xl border border-gray-700">
    <div className="bg-gray-800 pb-1 pl-4 pr-[0.38rem] pt-3">
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="my-1 text-xs text-gray-400">
        {videos.findIndex((video) => video.id === selectedId) + 1} /{" "}
        {videos.length}
      </p>
    </div>

    <ul className="max-h-[23rem] overflow-y-scroll bg-gray-900 [&::-webkit-scrollbar]:hidden">
      {videos.map((video, index) => (
        <li key={video.id}>
          <Link href={`/?v=${video.id}`} className="flex pb-1 pr-2 pt-2">
            <span className="w-6 self-center text-center text-xs">
              {index + 1}
            </span>
            <div className="relative">
              <Image
                src={video.thumbnail}
                width="128"
                height="128"
                alt={`${video.title}'s thumbnail`}
                className="h-14 w-[6.25rem] object-cover"
              />
              <span className="absolute bottom-0 right-0 m-1 rounded bg-black/75 px-1 py-[0.19rem] text-xs font-medium">
                {video.duration}
              </span>
            </div>
            <h2 className="flex-1 px-2 text-sm font-medium">{video.title}</h2>
          </Link>
        </li>
      ))}
    </ul>
  </aside>
);

export default Playlist;
