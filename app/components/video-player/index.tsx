"use client";

import { useEffect, useRef, useState } from "react";
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";

import ProgressBar from "./progress-bar";
import Sound from "./sound";

type Props = { src: string; className?: string; loop?: boolean };

const VideoPlayer = (props: Props) => {
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
    <div className={props.className + " relative"}>
      <video
        loop={props.loop}
        ref={videoRef}
        src={props.src}
        onClick={handleToggle}
        className="h-full w-full"
      />

      <div className="absolute bottom-0 left-0 right-0 mx-6 flex flex-col gap-4 bg-black/20 p-2 [&_svg]:text-[2rem] [&_svg]:text-white">
        <ProgressBar videoRef={videoRef} isPlaying={isPlaying} />

        <div className="flex justify-center">
          <button
            aria-label={`${isPlaying ? "pause" : "play"} video`}
            onClick={handleToggle}
          >
            {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          </button>

          <div className="absolute right-2 [&_svg]:text-[1.6rem]">
            <Sound videoRef={videoRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
