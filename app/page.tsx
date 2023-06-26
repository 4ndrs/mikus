"use client";

import { useState } from "react";

import Playlist from "./components/playlist";
import VideoPlayer from "./components/video-player";

const videos = [
  {
    title: "mikus.webm",
    src: "/mikus.webm",
    duration: "00:45",
    thumbnail: "/mikus.thumbnail.png",
  },
  {
    title: "1472407089017.webm",
    src: "/1472407089017.webm",
    duration: "00:26",
    thumbnail: "/1472407089017.thumbnail.png",
  },
];

const Home = () => {
  const [selected, setSelected] = useState("/mikus.webm");

  return (
    <main className="flex flex-col">
      <VideoPlayer loop src={selected} className="w-full lg:h-[80vh]" />

      <div className="mx-5 my-6">
        <Playlist
          title="初音ミク"
          videos={videos}
          selected={selected}
          onChange={(value) => setSelected(value)}
        />
      </div>
    </main>
  );
};

export default Home;
