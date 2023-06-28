"use client";

import { useState } from "react";

import Playlist from "./components/playlist";
import VideoPlayer from "./components/video-player";

const videos = [
  {
    id: "4Tg7e2P9R1",
    title: "mikus.webm",
    src: "/mikus.webm",
    duration: "00:45",
    thumbnail: "/mikus.thumbnail.png",
  },
  {
    id: "6Fh5d8J2K7",
    title: "1472407089017.webm",
    src: "/1472407089017.webm",
    duration: "00:26",
    thumbnail: "/1472407089017.thumbnail.png",
  },
  {
    id: "9Rj4k6E7H1",
    title: "racing_miku.webm",
    src: "/racing_miku.webm",
    duration: "00:36",
    thumbnail: "/racing_miku.thumbnail.png",
  },
  {
    id: "2Sg9h1K8D3",
    title: "MIKU.webm",
    src: "/MIKU.webm",
    duration: "00:21",
    thumbnail: "/MIKU.thumbnail.png",
  },
  {
    id: "3Mj6k7L9N4",
    title: "Magical Candy ミカヅキBIGWAVE.webm",
    src: "/Magical Candy ミカヅキBIGWAVE.webm",
    duration: "00:22",
    thumbnail: "/Magical Candy ミカヅキBIGWAVE.thumbnail.png",
  },
  {
    id: "8Bn5v3C4X9",
    title: "Astrophysics-Ms-Miku-After-Dark-cover.webm",
    src: "/Astrophysics-Ms-Miku-After-Dark-cover.webm",
    duration: "00:27",
    thumbnail: "/Astrophysics-Ms-Miku-After-Dark-cover.thumbnail.png",
  },
  {
    id: "1Ft9g7Y3Q6",
    title: "Arelice - Kissing Me hard.webm",
    src: "/Arelice - Kissing Me hard.webm",
    duration: "02:56",
    thumbnail: "/Arelice - Kissing Me hard.thumbnail.png",
  },
];

const Home = () => {
  const [selectedId, setSelectedId] = useState("4Tg7e2P9R1");

  const selectedVideo = videos.find((video) => video.id === selectedId);

  if (!selectedVideo) {
    throw new Error(`Selected video id "${selectedId}" was not found.`);
  }

  return (
    <main className="flex flex-col">
      <VideoPlayer src={selectedVideo.src} />

      <div className="mx-5 my-6">
        <Playlist
          title="初音ミク"
          videos={videos}
          selectedId={selectedId}
          onChange={(value) => setSelectedId(value)}
        />
      </div>
    </main>
  );
};

export default Home;
