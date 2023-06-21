"use client";

import { useEffect, useRef, useState } from "react";
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";

type Props = { src: string; className?: string; loop?: boolean };

const VideoPlayer = (props: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastUpdateRef = useRef(0);
  const lastPlayingStateRef = useRef(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    setDuration(videoElement?.duration || 0);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

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

    return () => {
      videoElement?.removeEventListener("play", handlePlay);
      videoElement?.removeEventListener("pause", handlePause);
      videoElement?.removeEventListener("timeupdate", handleTimeUpdate);
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
        </div>
      </div>
    </div>
  );
};

type PbProps = {
  max: number;
  current: number;
  onChange: (value: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
};

const ProgressBar = ({
  max,
  current,
  onChange,
  onDragStart,
  onDragEnd,
}: PbProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const position = `${((current / max) * 100).toFixed(3)}%`;

  const handleChange = (event: React.MouseEvent | MouseEvent) => {
    if (!barRef.current || event.clientX === 0) {
      return;
    }

    const barRect = barRef.current.getBoundingClientRect();
    const relativeX = event.clientX - barRect.left;
    const percentage = (relativeX / barRect.width) * 100;
    const value = +((max * percentage) / 100).toFixed(3);

    onChange(value);
  };

  const handlePointerDown = (event: React.MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    onDragStart();

    window.addEventListener("pointermove", handleChange);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerUp = () => {
    window.removeEventListener("pointermove", handleChange);
    window.removeEventListener("pointerup", handlePointerUp);

    onDragEnd();
  };

  return (
    <div onPointerDown={handlePointerDown} className="relative">
      <div
        ref={barRef}
        onClick={handleChange}
        className="relative h-1 overflow-hidden rounded bg-slate-300 hover:cursor-pointer"
      >
        <div style={{ width: position }} className="h-full bg-white" />
      </div>
      <div
        style={{ left: position }}
        className="absolute -top-1/3 h-4 w-4 -translate-x-1/2 -translate-y-1/3 cursor-pointer rounded-full border-[3px] border-white bg-slate-300"
      />
    </div>
  );
};

export default VideoPlayer;
