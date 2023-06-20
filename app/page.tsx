import VideoPlayer from "./components/video-player";

const Home = () => (
  <main className="flex flex-col md:m-9 lg:items-center">
    <VideoPlayer loop src="/mikus.webm" className="lg:w-[80rem]" />
  </main>
);

export default Home;
