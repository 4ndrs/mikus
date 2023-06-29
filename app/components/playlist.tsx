"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";
import Image from "next/image";

import type { Video } from "../types";

type Props = {
  title: string;
  videos: Video[];
  selectedIndex: number;
};

const Playlist = ({ title, videos, selectedIndex }: Props) => {
  const selectedRef = useRef<HTMLAnchorElement>(null);
  const scrollableParentRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!selectedRef.current || !scrollableParentRef.current) {
      return;
    }

    const scrollDistance = selectedRef.current.clientHeight * selectedIndex;

    scrollableParentRef.current.scroll({
      top: scrollDistance,
      behavior: "instant",
    });
  }, [selectedIndex]);

  return (
    <aside className="overflow-hidden rounded-xl border border-gray-700">
      <div className="bg-gray-800 pb-1 pl-4 pr-[0.38rem] pt-3">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="my-1 text-xs text-gray-400">
          {selectedIndex + 1} / {videos.length}
        </p>
      </div>

      <ul
        ref={scrollableParentRef}
        className="max-h-[23rem] overflow-y-scroll bg-gray-900 [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((video, index) => (
          <li key={video.id}>
            <Link
              ref={selectedIndex === index ? selectedRef : null}
              href={`/?v=${video.id}`}
              style={{
                backgroundColor:
                  selectedIndex === index && video.color
                    ? video.color + "26"
                    : "",
              }}
              className={`${
                selectedIndex === index
                  ? "bg-miku-3/25"
                  : "hover:bg-gray-500/20 focus-visible:bg-gray-500/20"
              } flex pb-1 pr-2 pt-2 outline-none`}
            >
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
};

export default Playlist;
