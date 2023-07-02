"use client";

import Playlist from "./playlist";
import VideoPlayer from "./video-player";

import type { Video } from "../types";

type Props = {
  videos: Video[];
  selectedIndex: number;
  previousVideo: Video;
  nextVideo: Video;
};

const Container = ({
  videos,
  selectedIndex,
  previousVideo,
  nextVideo,
}: Props) => (
  <div className="flex flex-col">
    <VideoPlayer
      src={videos[selectedIndex].src}
      color={videos[selectedIndex].color}
      nextHref={`/?v=${nextVideo.id}`}
      previousHref={`?v=${previousVideo.id}`}
    />

    <div className="mx-5 my-6">
      <Playlist
        title="初音ミク"
        videos={videos}
        selectedIndex={selectedIndex}
      />
    </div>
  </div>
);

export default Container;
