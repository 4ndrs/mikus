"use client";

import { useEffect, useRef, useState } from "react";
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";

import ProgressBar from "./progress-bar";
import Sound from "./sound";

type Props = { src: string; className?: string; loop?: boolean };

const VideoPlayer = (props: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0);
  const [muted, setMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastUpdateRef = useRef(0);
  const lastPlayingStateRef = useRef(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    setDuration(videoElement?.duration || 0);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setVolume(videoElement?.volume || 0);

    const handleTimeUpdate = () => {
      const current = videoElement?.currentTime || 0;
      const difference = (current - lastUpdateRef.current) * 1000;

      // Update after x milliseconds
      const milliseconds = 300;

      if (difference < 0 || difference > milliseconds) {
        setProgress(current);
        lastUpdateRef.current = current;
      }
    };

    videoElement?.addEventListener("play", handlePlay);
    videoElement?.addEventListener("pause", handlePause);
    videoElement?.addEventListener("timeupdate", handleTimeUpdate);
    videoElement?.addEventListener("volumechange", handleVolumeChange);

    return () => {
      videoElement?.removeEventListener("play", handlePlay);
      videoElement?.removeEventListener("pause", handlePause);
      videoElement?.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement?.removeEventListener("volumechange", handleVolumeChange);
    };
  }, []);

  const handleToggle = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  };

  const handleProgressBarChange = (value: number) => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.currentTime = value;
  };

  const handleDragStart = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      lastPlayingStateRef.current = true;
    }
  };

  const handleDragEnd = () => {
    if (lastPlayingStateRef.current) {
      videoRef.current?.play();
      lastPlayingStateRef.current = false;
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) {
      return;
    }

    if (muted) {
      videoRef.current.muted = false;
      setMuted(false);
    } else {
      videoRef.current.muted = true;
      setMuted(true);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.volume = value;
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
        <ProgressBar
          max={duration}
          current={progress}
          onChange={handleProgressBarChange}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />

        <div className="flex justify-center">
          <button
            aria-label={`${isPlaying ? "pause" : "play"} video`}
            onClick={handleToggle}
          >
            {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          </button>

          <div className="absolute right-2 [&_svg]:text-[1.6rem]">
            <Sound
              muted={muted}
              current={volume}
              onChange={handleVolumeChange}
              onClick={handleToggleMute}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
