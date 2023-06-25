import Playlist from "./components/playlist";
import VideoPlayer from "./components/video-player";

const videos = ["mikus.webm"];

const Home = () => (
  <main className="flex flex-col">
    <VideoPlayer loop src="/mikus.webm" className="w-full lg:h-[80vh]" />

    <div className="mx-5 my-6">
      <Playlist title="初音ミク" />
    </div>
  </main>
);

export default Home;
