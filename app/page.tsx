import { notFound, redirect } from "next/navigation";

import { type Metadata } from "next";

import Playlist from "./components/playlist";
import VideoPlayer from "./components/video-player";

const videos = [
  {
    id: "4Tg7e2P9R1",
    title: "mikus.webm",
    description: "dancing miku",
    src: "/mikus.webm",
    duration: "00:45",
    thumbnail: "/mikus.thumbnail.png",
  },
  {
    id: "6Fh5d8J2K7",
    title: "1472407089017.webm",
    description: "dancing miku V2",
    src: "/1472407089017.webm",
    duration: "00:26",
    thumbnail: "/1472407089017.thumbnail.png",
  },
  {
    id: "9Rj4k6E7H1",
    title: "racing_miku.webm",
    description: "vrooom vrooom miku",
    src: "/racing_miku.webm",
    duration: "00:36",
    thumbnail: "/racing_miku.thumbnail.png",
  },
  {
    id: "2Sg9h1K8D3",
    title: "MIKU.webm",
    description: "miku!!!",
    src: "/MIKU.webm",
    duration: "00:21",
    thumbnail: "/MIKU.thumbnail.png",
  },
  {
    id: "3Mj6k7L9N4",
    title: "Magical Candy ミカヅキBIGWAVE.webm",
    description: "cute miku",
    src: "/Magical Candy ミカヅキBIGWAVE.webm",
    duration: "00:22",
    thumbnail: "/Magical Candy ミカヅキBIGWAVE.thumbnail.png",
  },
  {
    id: "8Bn5v3C4X9",
    title: "Astrophysics-Ms-Miku-After-Dark-cover.webm",
    description: "melancholic miku",
    src: "/Astrophysics-Ms-Miku-After-Dark-cover.webm",
    duration: "00:27",
    thumbnail: "/Astrophysics-Ms-Miku-After-Dark-cover.thumbnail.png",
  },
  {
    id: "1Ft9g7Y3Q6",
    title: "Arelice - Kissing Me hard.webm",
    description: "cool miku",
    src: "/Arelice - Kissing Me hard.webm",
    duration: "02:56",
    thumbnail: "/Arelice - Kissing Me hard.thumbnail.png",
  },
];

type Props = { searchParams: { [key: string]: string | string[] | undefined } };

export const generateMetadata = async ({
  searchParams,
}: Props): Promise<Metadata> => {
  const selectedId =
    "v" in searchParams && typeof searchParams["v"] === "string"
      ? searchParams["v"]
      : "";

  const selectedVideo = videos.find((video) => video.id === selectedId);

  if (!selectedVideo) {
    return {};
  }

  return {
    title: selectedVideo.title,
    description: selectedVideo.description,
  };
};

const Home = ({ searchParams }: Props) => {
  const selectedId =
    "v" in searchParams && typeof searchParams["v"] === "string"
      ? searchParams["v"]
      : "";

  const selectedVideo = videos.find((video) => video.id === selectedId);

  if (!selectedId) {
    redirect("/?v=8Bn5v3C4X9");
  }

  if (!selectedVideo) {
    notFound();
  }

  return (
    <main className="flex flex-col">
      <VideoPlayer src={selectedVideo.src} />

      <div className="mx-5 my-6">
        <Playlist title="初音ミク" videos={videos} selectedId={selectedId} />
      </div>
    </main>
  );
};

export default Home;
