"use client";

import { useState } from "react";

import Playlist from "./playlist";
import VideoPlayer from "./video-player";

import type { Video } from "../types";

type Props = {
  videos: Video[];
  selectedIndex: number;
  previousVideo: Video;
  nextVideo: Video;
  smolMode: boolean;
};

const Container = ({
  videos,
  selectedIndex,
  previousVideo,
  nextVideo,
  smolMode,
}: Props) => {
  const [smol, setSmol] = useState(smolMode);

  const handleSmolToggle = () => {
    const nextSmol = !smol;

    setSmol(nextSmol);

    document.cookie = `smolMode=${
      nextSmol ? "yes" : "no"
    };samesite=strict;max-age=2147483647`;
  };

  return (
    <div
      className={`flex flex-col ${
        smol
          ? "lg:mx-6 lg:my-6 lg:w-[calc(100vw-(1.25rem*2))] lg:flex-row lg:justify-center lg:gap-5 "
          : ""
      }`}
    >
      <VideoPlayer
        src={videos[selectedIndex].src}
        color={videos[selectedIndex].color}
        nextHref={`/?v=${nextVideo.id}`}
        previousHref={`?v=${previousVideo.id}`}
        smolMode={smol}
        onSmolModeToggle={handleSmolToggle}
      />

      <div className={`mx-5 my-6 ${smol ? "lg:mx-0 lg:my-0" : ""}`}>
        <Playlist
          title="初音ミク"
          videos={videos}
          selectedIndex={selectedIndex}
          smolMode={smol}
        />
      </div>
    </div>
  );
};

export default Container;
