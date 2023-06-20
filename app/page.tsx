"use client";

import { useEffect, useRef, useState } from "react";

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement?.addEventListener("play", handlePlay);
    videoElement?.addEventListener("pause", handlePause);

    return () => {
      videoElement?.removeEventListener("play", handlePlay);
      videoElement?.removeEventListener("pause", handlePause);
    };
  }, []);

  const handleToggle = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  };

  return (
    <main className="flex flex-col md:m-9 lg:items-center">
      <video
        loop
        ref={videoRef}
        src="/mikus.webm"
        onClick={handleToggle}
        className="lg:w-[80rem]"
      />

      <button onClick={handleToggle}>{isPlaying ? "Pause" : "Play"}</button>
    </main>
  );
};

export default Home;
