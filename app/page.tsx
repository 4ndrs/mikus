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
  {
    title: "racing_miku.webm",
    src: "/racing_miku.webm",
    duration: "00:36",
    thumbnail: "/racing_miku.thumbnail.png",
  },
  {
    title: "MIKU.webm",
    src: "/MIKU.webm",
    duration: "00:21",
    thumbnail: "/MIKU.thumbnail.png",
  },
  {
    title: "Magical Candy ミカヅキBIGWAVE.webm",
    src: "/Magical Candy ミカヅキBIGWAVE.webm",
    duration: "00:22",
    thumbnail: "/Magical Candy ミカヅキBIGWAVE.thumbnail.png",
  },
  {
    title: "Astrophysics-Ms-Miku-After-Dark-cover.webm",
    src: "/Astrophysics-Ms-Miku-After-Dark-cover.webm",
    duration: "00:27",
    thumbnail: "/Astrophysics-Ms-Miku-After-Dark-cover.thumbnail.png",
  },
  {
    title: "Arelice - Kissing Me hard.webm",
    src: "/Arelice - Kissing Me hard.webm",
    duration: "02:56",
    thumbnail: "/Arelice - Kissing Me hard.thumbnail.png",
  },
];

const Home = () => {
  const [selected, setSelected] = useState("/mikus.webm");

  return (
    <main className="flex flex-col">
      <VideoPlayer loop src={selected} className="h-80 w-full lg:h-[80vh]" />

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
