import VideoPlayer from "./components/video-player";

const Home = () => (
  <main className="flex flex-col lg:items-center">
    <VideoPlayer loop src="/mikus.webm" className="w-full lg:h-[80vh]" />
  </main>
);

export default Home;
