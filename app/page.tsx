import VideoPlayer from "./components/video-player";

import { generateThumbnail } from "./lib/thumbnails";

const videos = ["mikus.webm"];

const Home = () => (
  <main className="flex flex-col lg:items-center">
    <VideoPlayer loop src="/mikus.webm" className="w-full lg:h-[80vh]" />
    <h1>{generateThumbnail(videos[0])}</h1>
  </main>
);

export default Home;
