"use client";

import { useEffect, useRef, useState } from "react";

import {
  CaretRightFilled,
  PauseOutlined,
  RetweetOutlined,
} from "@ant-design/icons";

import ProgressBar from "./progress-bar";
import Sound from "./sound";

type Props = { src: string; className?: string; loop?: boolean };

const VideoPlayer = (props: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(props.loop);

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

  const handleLoopToggle = () => {
    if (!videoRef.current) {
      return;
    }

    if (videoRef.current.loop) {
      videoRef.current.loop = false;
      setLoop(false);
    } else {
      videoRef.current.loop = true;
      setLoop(true);
    }
  };

  return (
    <div className={props.className + " relative bg-black"}>
      <video
        loop={props.loop}
        ref={videoRef}
        src={props.src}
        onClick={handleToggle}
        className="mx-auto h-full"
      />

      <div className="absolute bottom-0 left-0 right-0 mx-6 flex flex-col gap-4 bg-black/20 p-2 [&_svg]:text-[1.4rem] [&_svg]:text-white">
        <ProgressBar videoRef={videoRef} isPlaying={isPlaying} />

        <div className="flex justify-center">
          <button
            aria-label={`${isPlaying ? "pause" : "play"} video`}
            onClick={handleToggle}
          >
            {isPlaying ? <PauseOutlined /> : <CaretRightFilled />}
          </button>
          <button
            aria-label={`${loop ? "disable" : "activate"} loop`}
            className={`${loop ? "" : "[&_svg]:text-slate-400"}`}
            onClick={handleLoopToggle}
          >
            <RetweetOutlined />
          </button>

          <div className="absolute right-2">
            <Sound videoRef={videoRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
