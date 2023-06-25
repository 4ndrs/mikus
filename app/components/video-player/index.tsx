"use client";

import { useEffect, useRef, useState } from "react";

import {
  CaretRightFilled,
  HeartFilled,
  PauseOutlined,
  RetweetOutlined,
} from "@ant-design/icons";

import TimeVisualizer from "./time-visualizer";
import ProgressBar from "./progress-bar";
import Button from "./button";
import Sound from "./sound";

type Props = { src: string; className?: string; loop?: boolean };

const VideoPlayer = (props: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(props.loop);
  const [openMenu, setOpenMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hidingControls, setHidingControls] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const menuPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const videoElement = videoRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      setHidingControls(false);
      setShowControls(true);
    };

    videoElement?.addEventListener("play", handlePlay);
    videoElement?.addEventListener("pause", handlePause);
    videoElement?.addEventListener("ended", handleEnded);

    return () => {
      videoElement?.removeEventListener("play", handlePlay);
      videoElement?.removeEventListener("pause", handlePause);
      videoElement?.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handlePlayToggle = () => {
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

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    menuPositionRef.current = { x: event.clientX, y: event.clientY };
    setOpenMenu(true);
  };

  return (
    <div
      onMouseEnter={() => {
        setHidingControls(false);
        setShowControls(true);
      }}
      onMouseLeave={() => {
        if (isPlaying) {
          setHidingControls(true);
        }
      }}
      className={props.className + " group/player relative bg-black"}
    >
      <video
        loop={props.loop}
        ref={videoRef}
        src={props.src}
        onClick={() => {
          if (showControls) {
            handlePlayToggle();
          } else {
            setShowControls(true);
          }
        }}
        onContextMenu={handleContextMenu}
        className="mx-auto h-full"
      />

      <div
        style={{
          top: menuPositionRef.current.y,
          left: menuPositionRef.current.x,
        }}
        className={`${
          openMenu ? "flex" : "hidden"
        } fixed h-12 w-24 items-center justify-center gap-2 rounded bg-black`}
      >
        <div
          onClick={() => setOpenMenu(false)}
          className="fixed inset-0 bg-transparent"
        />
        <HeartFilled className="text-red-600" /> Mikus
      </div>

      <div
        onAnimationEnd={() => {
          if (hidingControls) {
            setHidingControls(false);
            setShowControls(false);
          }
        }}
        className={`${
          !showControls
            ? "hidden"
            : hidingControls
            ? "flex animate-fade-out"
            : "flex animate-fade-in"
        } absolute bottom-0 left-0 right-0 mx-6 flex-col gap-4 bg-black/20 p-2`}
      >
        <ProgressBar videoRef={videoRef} isPlaying={isPlaying} />

        <div className="flex items-center justify-between">
          <TimeVisualizer videoRef={videoRef} />

          <div className="flex gap-1">
            <Button
              aria-label={`${isPlaying ? "pause" : "play"} video`}
              onClick={handlePlayToggle}
            >
              {isPlaying ? <PauseOutlined /> : <CaretRightFilled />}
            </Button>
            <Button
              aria-label={`${loop ? "disable" : "activate"} loop`}
              className={`${loop ? "" : "text-slate-400"}`}
              onClick={handleLoopToggle}
            >
              <RetweetOutlined />
            </Button>
          </div>

          <Sound videoRef={videoRef} />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
