"use client";

import { useEffect, useRef, useState } from "react";

import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  SoundFilled,
} from "@ant-design/icons";

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

    handleChange(event);

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
    <div
      onPointerDown={handlePointerDown}
      className="relative select-none pt-2 hover:cursor-pointer"
    >
      <div
        ref={barRef}
        className="relative h-1 overflow-hidden rounded bg-slate-300"
      >
        <div style={{ width: position }} className="h-full bg-white" />
      </div>
      <div
        style={{ left: position }}
        className="absolute -top-1/3 h-4 w-4 -translate-x-1/2 translate-y-1/3 cursor-pointer rounded-full border-[3px] border-white bg-slate-300"
      />
    </div>
  );
};

type SProps = {
  muted: boolean;
  current: number;
  onClick: () => void;
  onChange: (value: number) => void;
};

const Sound = ({ muted, onClick, current, onChange }: SProps) => {
  const position = `${current * 100}%`;
  const barRef = useRef<HTMLDivElement>(null);
  const max = 1.0;

  const handleChange = (event: React.MouseEvent | MouseEvent) => {
    if (!barRef.current || event.clientY === 0) {
      return;
    }

    const barRect = barRef.current.getBoundingClientRect();
    const relativeY = barRect.bottom - event.clientY;
    const percentage = (relativeY / barRect.height) * 100;
    const value = +((max * percentage) / 100).toFixed(3);

    onChange(value > 1 ? 1 : value < 0 ? 0 : value);
  };

  const handlePointerDown = (event: React.MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    handleChange(event);

    window.addEventListener("pointermove", handleChange);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerUp = () => {
    window.removeEventListener("pointermove", handleChange);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  return (
    <div className="relative select-none hover:cursor-pointer">
      <div
        ref={barRef}
        onPointerDown={handlePointerDown}
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded bg-slate-600 px-4 py-2"
      >
        <div className="relative h-14 w-[0.34rem] rounded bg-slate-700">
          <div
            style={{ top: `calc(100% - ${position})` }}
            className="absolute inset-x-0 bottom-0 rounded bg-white"
          >
            <div className="absolute left-0 top-0 h-3 w-3 -translate-x-1/4 -translate-y-1/2 rounded-full bg-white" />
          </div>
        </div>
      </div>

      <button onClick={onClick}>
        {muted ? <SoundOutlined /> : <SoundFilled />}
      </button>
    </div>
  );
};

export default VideoPlayer;
